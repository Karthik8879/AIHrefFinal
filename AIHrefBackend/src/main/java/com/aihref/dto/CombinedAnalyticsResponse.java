package com.aihref.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CombinedAnalyticsResponse {
    
    private String range;
    
    // Combined Traffic Summary
    private Long totalVisitors;
    private Long totalTodayVisitors;
    private Long totalWeekVisitors;
    private Long totalMonthVisitors;
    private Long totalRepeatVisitors;
    
    // Site-specific data
    private List<SiteAnalytics> sites;
    
    // Aggregated top data
    private List<CountryCount> topCountries;
    private List<PageCount> topPages;
    private List<SourceCount> topSources;
    private List<DailyVisitorCount> dailyVisitors;
    
    private LocalDateTime lastUpdated;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SiteAnalytics {
        private String siteId;
        private String siteName;
        private String website;
        private Long visitors;
        private Long todayVisitors;
        private Long weekVisitors;
        private Long monthVisitors;
        private Long repeatVisitors;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CountryCount {
        private String country;
        private Long count;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PageCount {
        private String page;
        private Long count;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SourceCount {
        private String source;
        private Long count;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyVisitorCount {
        private String date;
        private Long visitors;
        private Long pageviews;
    }
}
