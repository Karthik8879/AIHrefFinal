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
                    .filter(event -> event.getTs() == null || 
                            (!event.getTs().toLocalDate().isBefore(startDate) && 
                             !event.getTs().toLocalDate().isAfter(endDate)))
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
                .filter(event -> event.getTs() != null && 
                        event.getTs().toLocalDate().equals(LocalDate.now()))
                .map(RawEvent::getAnonId)
                .distinct()
                .count();
        
        long thisWeekVisitors = allEvents.stream()
                .filter(event -> event.getTs() != null && 
                        isInCurrentWeek(event.getTs().toLocalDate()))
                .map(RawEvent::getAnonId)
                .distinct()
                .count();
        
        long thisMonthVisitors = allEvents.stream()
                .filter(event -> event.getTs() != null && 
                        event.getTs().toLocalDate().getMonth() == LocalDate.now().getMonth() &&
                        event.getTs().toLocalDate().getYear() == LocalDate.now().getYear())
                .map(RawEvent::getAnonId)
                .distinct()
                .count();
        
        // Repeat visitors (simplified - visitors who appear more than once)
        Map<String, Long> visitorCounts = allEvents.stream()
                .collect(Collectors.groupingBy(RawEvent::getAnonId, Collectors.counting()));
        
        long repeatVisitorsToday = allEvents.stream()
                .filter(event -> event.getTs() != null && 
                        event.getTs().toLocalDate().equals(LocalDate.now()))
                .map(RawEvent::getAnonId)
                .filter(anonId -> visitorCounts.getOrDefault(anonId, 0L) > 1)
                .distinct()
                .count();
        
        // Peak Visit Day
        Map<LocalDate, Long> dailyVisits = filteredEvents.stream()
                .filter(event -> event.getTs() != null)
                .collect(Collectors.groupingBy(
                        event -> event.getTs().toLocalDate(),
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
        
        // Top Locations - using actual city and country data
        List<EnhancedAnalyticsResponse.LocationCount> topLocations = filteredEvents.stream()
                .filter(event -> event.getCountry() != null && !event.getCountry().isEmpty() && 
                               !event.getCountry().equals("Unknown"))
                .collect(Collectors.groupingBy(
                        event -> {
                            String city = (event.getCity() != null && !event.getCity().isEmpty() && 
                                          !event.getCity().equals("Unknown")) 
                                         ? event.getCity() 
                                         : "Unknown";
                            return city + ", " + event.getCountry();
                        },
                        Collectors.counting()
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .map(entry -> {
                    String[] parts = entry.getKey().split(", ");
                    String city = parts.length > 1 ? parts[0] : "Unknown";
                    String country = parts.length > 1 ? parts[1] : parts[0];
                    return new EnhancedAnalyticsResponse.LocationCount(
                            city, country, entry.getValue());
                })
                .collect(Collectors.toList());
        
        // Daily Visitor Trends - Generate complete time series
        List<EnhancedAnalyticsResponse.DailyVisitorCount> dailyVisitorTrends = generateCompleteTimeSeries(
                filteredEvents, startDate, endDate, range);
        
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
    
    private List<EnhancedAnalyticsResponse.DailyVisitorCount> generateCompleteTimeSeries(
            List<RawEvent> filteredEvents, LocalDate startDate, LocalDate endDate, String range) {
        
        List<EnhancedAnalyticsResponse.DailyVisitorCount> timeSeries = new ArrayList<>();
        
        // Generate data points based on range
        switch (range.toLowerCase()) {
            case "7d":
                // Last 7 days - daily data
                for (int i = 6; i >= 0; i--) {
                    LocalDate date = endDate.minusDays(i);
                    long visitors = countUniqueVisitorsForDate(filteredEvents, date);
                    long pageviews = countPageviewsForDate(filteredEvents, date);
                    timeSeries.add(new EnhancedAnalyticsResponse.DailyVisitorCount(date, visitors, pageviews));
                }
                break;
                
            case "1m":
            case "30d":
                // Last 30 days - daily data
                for (int i = 29; i >= 0; i--) {
                    LocalDate date = endDate.minusDays(i);
                    long visitors = countUniqueVisitorsForDate(filteredEvents, date);
                    long pageviews = countPageviewsForDate(filteredEvents, date);
                    timeSeries.add(new EnhancedAnalyticsResponse.DailyVisitorCount(date, visitors, pageviews));
                }
                break;
                
            case "1y":
                // Last 12 months - aggregate data for each month
                for (int i = 11; i >= 0; i--) {
                    LocalDate monthStart = endDate.minusMonths(i).withDayOfMonth(1);
                    LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
                    
                    // Ensure we don't go beyond the end date
                    if (monthEnd.isAfter(endDate)) {
                        monthEnd = endDate;
                    }
                    
                    long visitors = countUniqueVisitorsForDateRange(filteredEvents, monthStart, monthEnd);
                    long pageviews = countPageviewsForDateRange(filteredEvents, monthStart, monthEnd);
                    timeSeries.add(new EnhancedAnalyticsResponse.DailyVisitorCount(monthStart, visitors, pageviews));
                }
                break;
                
            case "5y":
                // Last 5 years - aggregate data for each year
                for (int i = 4; i >= 0; i--) {
                    LocalDate yearStart = endDate.minusYears(i).withDayOfYear(1);
                    LocalDate yearEnd = yearStart.withDayOfYear(yearStart.lengthOfYear());
                    
                    // Ensure we don't go beyond the end date
                    if (yearEnd.isAfter(endDate)) {
                        yearEnd = endDate;
                    }
                    
                    long visitors = countUniqueVisitorsForDateRange(filteredEvents, yearStart, yearEnd);
                    long pageviews = countPageviewsForDateRange(filteredEvents, yearStart, yearEnd);
                    timeSeries.add(new EnhancedAnalyticsResponse.DailyVisitorCount(yearStart, visitors, pageviews));
                }
                break;
                
            default:
                // For other ranges, generate daily data
                LocalDate current = startDate;
                while (!current.isAfter(endDate)) {
                    long visitors = countUniqueVisitorsForDate(filteredEvents, current);
                    long pageviews = countPageviewsForDate(filteredEvents, current);
                    timeSeries.add(new EnhancedAnalyticsResponse.DailyVisitorCount(current, visitors, pageviews));
                    current = current.plusDays(1);
                }
                break;
        }
        
        return timeSeries;
    }
    
    private long countUniqueVisitorsForDate(List<RawEvent> events, LocalDate date) {
        return events.stream()
                .filter(event -> event.getTs() != null && event.getTs().toLocalDate().equals(date))
                .map(RawEvent::getAnonId)
                .distinct()
                .count();
    }
    
    private long countPageviewsForDate(List<RawEvent> events, LocalDate date) {
        return events.stream()
                .filter(event -> event.getTs() != null && event.getTs().toLocalDate().equals(date))
                .count();
    }
    
    private long countUniqueVisitorsForDateRange(List<RawEvent> events, LocalDate startDate, LocalDate endDate) {
        return events.stream()
                .filter(event -> event.getTs() != null && 
                        !event.getTs().toLocalDate().isBefore(startDate) && 
                        !event.getTs().toLocalDate().isAfter(endDate))
                .map(RawEvent::getAnonId)
                .distinct()
                .count();
    }
    
    private long countPageviewsForDateRange(List<RawEvent> events, LocalDate startDate, LocalDate endDate) {
        return events.stream()
                .filter(event -> event.getTs() != null && 
                        !event.getTs().toLocalDate().isBefore(startDate) && 
                        !event.getTs().toLocalDate().isAfter(endDate))
                .count();
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
