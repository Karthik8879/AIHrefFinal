package com.aihref.service;

import com.aihref.dto.EnhancedAnalyticsResponse;
import com.aihref.model.RawEvent;
import com.aihref.repository.RawEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnhancedAnalyticsService {
    
    private final RawEventRepository rawEventRepository;
    
    public EnhancedAnalyticsResponse getEnhancedAnalytics(String siteId, String range) {
        log.info("Getting enhanced analytics for siteId: {} and range: {}", siteId, range);
        
        try {
            LocalDate endDate = LocalDate.now();
            LocalDate startDate = calculateStartDate(endDate, range);
            
            log.info("Fetching raw events for siteId: {} from {} to {}", siteId, startDate, endDate);
            
            // Get all events for this siteId (including null timestamps)
            List<RawEvent> allEvents = rawEventRepository.findBySiteId(siteId);
            
            if (allEvents.isEmpty()) {
                log.info("No raw events found for siteId: {}", siteId);
                return createEmptyResponse(siteId, range);
            }
            
            // Filter events by date range if they have timestamps
            List<RawEvent> filteredEvents = allEvents.stream()
                    .filter(event -> event.getTimestamp() == null || 
                            (!event.getTimestamp().toLocalDate().isBefore(startDate) && 
                             !event.getTimestamp().toLocalDate().isAfter(endDate)))
                    .collect(Collectors.toList());
            
            log.info("Found {} events for siteId: {} in range: {}", filteredEvents.size(), siteId, range);
            
            // Calculate all metrics
            return calculateEnhancedMetrics(siteId, range, filteredEvents, allEvents, startDate, endDate);
            
        } catch (Exception e) {
            log.error("Error getting enhanced analytics for siteId: {} and range: {}", siteId, range, e);
            throw new RuntimeException("Failed to get enhanced analytics", e);
        }
    }
    
    private EnhancedAnalyticsResponse calculateEnhancedMetrics(String siteId, String range, 
            List<RawEvent> filteredEvents, List<RawEvent> allEvents, 
            LocalDate startDate, LocalDate endDate) {
        
        // Traffic Summary
        long totalVisitorsTillDate = allEvents.stream()
                .map(RawEvent::getAnonId)
                .distinct()
                .count();
        
        long todayVisitors = allEvents.stream()
                .filter(event -> event.getTimestamp() != null && 
                        event.getTimestamp().toLocalDate().equals(LocalDate.now()))
                .map(RawEvent::getAnonId)
                .distinct()
                .count();
        
        long thisWeekVisitors = allEvents.stream()
                .filter(event -> event.getTimestamp() != null && 
                        isInCurrentWeek(event.getTimestamp().toLocalDate()))
                .map(RawEvent::getAnonId)
                .distinct()
                .count();
        
        long thisMonthVisitors = allEvents.stream()
                .filter(event -> event.getTimestamp() != null && 
                        event.getTimestamp().toLocalDate().getMonth() == LocalDate.now().getMonth() &&
                        event.getTimestamp().toLocalDate().getYear() == LocalDate.now().getYear())
                .map(RawEvent::getAnonId)
                .distinct()
                .count();
        
        // Repeat visitors (simplified - visitors who appear more than once)
        Map<String, Long> visitorCounts = allEvents.stream()
                .collect(Collectors.groupingBy(RawEvent::getAnonId, Collectors.counting()));
        
        long repeatVisitorsToday = allEvents.stream()
                .filter(event -> event.getTimestamp() != null && 
                        event.getTimestamp().toLocalDate().equals(LocalDate.now()))
                .map(RawEvent::getAnonId)
                .filter(anonId -> visitorCounts.getOrDefault(anonId, 0L) > 1)
                .distinct()
                .count();
        
        // Peak Visit Day
        Map<LocalDate, Long> dailyVisits = filteredEvents.stream()
                .filter(event -> event.getTimestamp() != null)
                .collect(Collectors.groupingBy(
                        event -> event.getTimestamp().toLocalDate(),
                        Collectors.counting()
                ));
        
        Map.Entry<LocalDate, Long> peakDay = dailyVisits.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .orElse(Map.entry(LocalDate.now(), 0L));
        
        // Top Country
        String topCountry = filteredEvents.stream()
                .filter(event -> event.getCountry() != null)
                .collect(Collectors.groupingBy(RawEvent::getCountry, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Unknown");
        
        // Top Source
        String topSource = filteredEvents.stream()
                .filter(event -> event.getReferrer() != null)
                .collect(Collectors.groupingBy(RawEvent::getReferrer, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Direct");
        
        // Performance Over Time
        long totalDays = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        long totalWeeks = ChronoUnit.WEEKS.between(startDate, endDate) + 1;
        
        double avgVisitsPerDay = totalDays > 0 ? (double) filteredEvents.size() / totalDays : 0.0;
        double avgVisitsPerWeek = totalWeeks > 0 ? (double) filteredEvents.size() / totalWeeks : 0.0;
        double avgRepeatVisitorsPerDay = totalDays > 0 ? (double) repeatVisitorsToday / totalDays : 0.0;
        
        // Top Pages
        List<EnhancedAnalyticsResponse.PageCount> topPages = filteredEvents.stream()
                .filter(event -> event.getUrl() != null)
                .collect(Collectors.groupingBy(RawEvent::getUrl, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> new EnhancedAnalyticsResponse.PageCount(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
        
        // Top Countries
        List<EnhancedAnalyticsResponse.CountryCount> topCountries = filteredEvents.stream()
                .filter(event -> event.getCountry() != null)
                .collect(Collectors.groupingBy(RawEvent::getCountry, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .map(entry -> new EnhancedAnalyticsResponse.CountryCount(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
        
        // Top Sources
        List<EnhancedAnalyticsResponse.SourceCount> topSources = filteredEvents.stream()
                .filter(event -> event.getReferrer() != null)
                .collect(Collectors.groupingBy(RawEvent::getReferrer, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .map(entry -> new EnhancedAnalyticsResponse.SourceCount(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
        
        // Top Locations (simplified - using country for now)
        List<EnhancedAnalyticsResponse.LocationCount> topLocations = filteredEvents.stream()
                .filter(event -> event.getCountry() != null)
                .collect(Collectors.groupingBy(RawEvent::getCountry, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .map(entry -> new EnhancedAnalyticsResponse.LocationCount(
                        "Unknown", "Unknown", entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
        
        // Daily Visitor Trends
        List<EnhancedAnalyticsResponse.DailyVisitorCount> dailyVisitorTrends = dailyVisits.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> {
                    long visitors = filteredEvents.stream()
                            .filter(event -> event.getTimestamp() != null && 
                                    event.getTimestamp().toLocalDate().equals(entry.getKey()))
                            .map(RawEvent::getAnonId)
                            .distinct()
                            .count();
                    return new EnhancedAnalyticsResponse.DailyVisitorCount(
                            entry.getKey(), visitors, entry.getValue());
                })
                .collect(Collectors.toList());
        
        return new EnhancedAnalyticsResponse(
                siteId, range,
                totalVisitorsTillDate, todayVisitors, thisWeekVisitors, thisMonthVisitors, repeatVisitorsToday,
                peakDay.getKey().toString(), peakDay.getValue(), topCountry, topSource,
                avgVisitsPerDay, avgVisitsPerWeek, avgRepeatVisitorsPerDay,
                topPages, topCountries, topSources, topLocations, dailyVisitorTrends,
                LocalDateTime.now()
        );
    }
    
    private boolean isInCurrentWeek(LocalDate date) {
        LocalDate now = LocalDate.now();
        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        int currentWeek = now.get(weekFields.weekOfYear());
        int currentYear = now.get(weekFields.weekBasedYear());
        int dateWeek = date.get(weekFields.weekOfYear());
        int dateYear = date.get(weekFields.weekBasedYear());
        return currentWeek == dateWeek && currentYear == dateYear;
    }
    
    private LocalDate calculateStartDate(LocalDate endDate, String range) {
        return switch (range.toLowerCase()) {
            case "7d" -> endDate.minusDays(6);
            case "1m" -> endDate.minusDays(29);
            case "30d" -> endDate.minusDays(29);
            case "1y" -> endDate.minusDays(364);
            case "5y" -> endDate.minusDays(1824);
            case "all" -> LocalDate.of(2020, 1, 1);
            default -> throw new IllegalArgumentException("Invalid range: " + range + ". Supported values: 7d, 1m, 30d, 1y, 5y, all");
        };
    }
    
    private EnhancedAnalyticsResponse createEmptyResponse(String siteId, String range) {
        return new EnhancedAnalyticsResponse(
                siteId, range,
                0L, 0L, 0L, 0L, 0L,
                "N/A", 0L, "Unknown", "Direct",
                0.0, 0.0, 0.0,
                List.of(), List.of(), List.of(), List.of(), List.of(),
                LocalDateTime.now()
        );
    }
}
