package com.aihref.service;

import com.aihref.dto.CombinedAnalyticsResponse;
import com.aihref.dto.EnhancedAnalyticsResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CombinedAnalyticsService {
    
    private final EnhancedAnalyticsService enhancedAnalyticsService;
    
    // Define the sites we want to include in combined analytics
    private static final List<SiteInfo> SITES = Arrays.asList(
        new SiteInfo("greplus", "GRE Plus", "greplus.com"),
        new SiteInfo("novareaders", "Nova Readers", "novareaders.com"),
        new SiteInfo("aixrayassist", "AI X-Ray Assist", "aixrayassist.com"),
        new SiteInfo("aihref", "AIHref", "aihref.com")
    );
    
    public CombinedAnalyticsResponse getCombinedAnalytics(String range) {
        log.info("Getting combined analytics for range: {}", range);
        
        try {
            CombinedAnalyticsResponse response = new CombinedAnalyticsResponse();
            response.setRange(range);
            response.setLastUpdated(LocalDateTime.now());
            
            // Initialize aggregated data
            response.setTotalVisitors(0L);
            response.setTotalTodayVisitors(0L);
            response.setTotalWeekVisitors(0L);
            response.setTotalMonthVisitors(0L);
            response.setTotalRepeatVisitors(0L);
            
            List<CombinedAnalyticsResponse.SiteAnalytics> sites = new ArrayList<>();
            Map<String, Long> countryMap = new HashMap<>();
            Map<String, Long> pageMap = new HashMap<>();
            Map<String, Long> sourceMap = new HashMap<>();
            Map<String, CombinedAnalyticsResponse.DailyVisitorCount> dailyMap = new HashMap<>();
            
            // Fetch analytics for each site
            for (SiteInfo site : SITES) {
                try {
                    EnhancedAnalyticsResponse siteAnalytics = enhancedAnalyticsService.getEnhancedAnalytics(site.siteId, range);
                    
                    if (siteAnalytics != null) {
                        // Add to site-specific data
                        CombinedAnalyticsResponse.SiteAnalytics siteData = new CombinedAnalyticsResponse.SiteAnalytics();
                        siteData.setSiteId(site.siteId);
                        siteData.setSiteName(site.siteName);
                        siteData.setWebsite(site.website);
                        siteData.setVisitors(siteAnalytics.getTotalVisitorsTillDate() != null ? siteAnalytics.getTotalVisitorsTillDate() : 0L);
                        siteData.setTodayVisitors(siteAnalytics.getTodayVisitors() != null ? siteAnalytics.getTodayVisitors() : 0L);
                        siteData.setWeekVisitors(siteAnalytics.getThisWeekVisitors() != null ? siteAnalytics.getThisWeekVisitors() : 0L);
                        siteData.setMonthVisitors(siteAnalytics.getThisMonthVisitors() != null ? siteAnalytics.getThisMonthVisitors() : 0L);
                        siteData.setRepeatVisitors(siteAnalytics.getRepeatVisitorsToday() != null ? siteAnalytics.getRepeatVisitorsToday() : 0L);
                        
                        sites.add(siteData);
                        
                        // Aggregate totals
                        response.setTotalVisitors(response.getTotalVisitors() + siteData.getVisitors());
                        response.setTotalTodayVisitors(response.getTotalTodayVisitors() + siteData.getTodayVisitors());
                        response.setTotalWeekVisitors(response.getTotalWeekVisitors() + siteData.getWeekVisitors());
                        response.setTotalMonthVisitors(response.getTotalMonthVisitors() + siteData.getMonthVisitors());
                        response.setTotalRepeatVisitors(response.getTotalRepeatVisitors() + siteData.getRepeatVisitors());
                        
                        // Aggregate top countries
                        if (siteAnalytics.getTopCountries() != null) {
                            siteAnalytics.getTopCountries().forEach(country -> {
                                countryMap.merge(country.getCountry(), country.getCount(), Long::sum);
                            });
                        }
                        
                        // Aggregate top pages
                        if (siteAnalytics.getTopPages() != null) {
                            siteAnalytics.getTopPages().forEach(page -> {
                                pageMap.merge(page.getUrl(), page.getCount(), Long::sum);
                            });
                        }
                        
                        // Aggregate top sources
                        if (siteAnalytics.getTopSources() != null) {
                            siteAnalytics.getTopSources().forEach(source -> {
                                sourceMap.merge(source.getSource(), source.getCount(), Long::sum);
                            });
                        }
                        
                        // Aggregate daily visitors
                        if (siteAnalytics.getDailyVisitorTrends() != null) {
                            siteAnalytics.getDailyVisitorTrends().forEach(daily -> {
                                String dateKey = daily.getDate().format(DateTimeFormatter.ISO_LOCAL_DATE);
                                CombinedAnalyticsResponse.DailyVisitorCount existing = dailyMap.get(dateKey);
                                if (existing != null) {
                                    existing.setVisitors(existing.getVisitors() + daily.getVisitors());
                                    existing.setPageviews(existing.getPageviews() + daily.getPageviews());
                                } else {
                                    CombinedAnalyticsResponse.DailyVisitorCount newDaily = new CombinedAnalyticsResponse.DailyVisitorCount();
                                    newDaily.setDate(dateKey);
                                    newDaily.setVisitors(daily.getVisitors());
                                    newDaily.setPageviews(daily.getPageviews());
                                    dailyMap.put(dateKey, newDaily);
                                }
                            });
                        }
                        
                        log.info("Successfully processed analytics for site: {}", site.siteId);
                    } else {
                        log.warn("No analytics data found for site: {}", site.siteId);
                    }
                    
                } catch (Exception e) {
                    log.error("Error fetching analytics for site: {}", site.siteId, e);
                }
            }
            
            // Set aggregated data
            response.setSites(sites);
            
            // Sort and limit top data
            response.setTopCountries(countryMap.entrySet().stream()
                .map(entry -> new CombinedAnalyticsResponse.CountryCount(entry.getKey(), entry.getValue()))
                .sorted((a, b) -> Long.compare(b.getCount(), a.getCount()))
                .limit(10)
                .collect(Collectors.toList()));
            
            response.setTopPages(pageMap.entrySet().stream()
                .map(entry -> new CombinedAnalyticsResponse.PageCount(entry.getKey(), entry.getValue()))
                .sorted((a, b) -> Long.compare(b.getCount(), a.getCount()))
                .limit(10)
                .collect(Collectors.toList()));
            
            response.setTopSources(sourceMap.entrySet().stream()
                .map(entry -> new CombinedAnalyticsResponse.SourceCount(entry.getKey(), entry.getValue()))
                .sorted((a, b) -> Long.compare(b.getCount(), a.getCount()))
                .limit(10)
                .collect(Collectors.toList()));
            
            response.setDailyVisitors(dailyMap.values().stream()
                .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                .collect(Collectors.toList()));
            
            log.info("Successfully generated combined analytics with {} sites", sites.size());
            return response;
            
        } catch (Exception e) {
            log.error("Error generating combined analytics", e);
            throw new RuntimeException("Failed to generate combined analytics", e);
        }
    }
    
    private static class SiteInfo {
        final String siteId;
        final String siteName;
        final String website;
        
        SiteInfo(String siteId, String siteName, String website) {
            this.siteId = siteId;
            this.siteName = siteName;
            this.website = website;
        }
    }
}
