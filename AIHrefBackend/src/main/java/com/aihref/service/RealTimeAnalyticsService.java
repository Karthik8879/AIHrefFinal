package com.aihref.service;

import com.aihref.dto.AnalyticsSummaryResponse;
import com.aihref.model.RawEvent;
import com.aihref.repository.RawEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RealTimeAnalyticsService {
    
    private final RawEventRepository rawEventRepository;
    
    public AnalyticsSummaryResponse getRealTimeAnalyticsSummary(String siteId, String range) {
        log.info("Getting real-time analytics summary for siteId: {} and range: {}", siteId, range);
        
        try {
            LocalDate endDate = LocalDate.now();
            LocalDate startDate = calculateStartDate(endDate, range);
            
            LocalDateTime startDateTime = startDate.atStartOfDay();
            LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
            
            log.info("Fetching raw events for siteId: {} from {} to {}", siteId, startDateTime, endDateTime);
            
            // First try to get events with timestamps in range
            List<RawEvent> rawEvents = rawEventRepository.findBySiteIdAndTsBetween(siteId, startDateTime, endDateTime);
            
            // If no events found with timestamps, get all events for this siteId (including null timestamps)
            if (rawEvents.isEmpty()) {
                log.info("No events found with timestamps in range, fetching all events for siteId: {}", siteId);
                rawEvents = rawEventRepository.findBySiteId(siteId);
            }
            
            if (rawEvents.isEmpty()) {
                log.info("No raw events found for siteId: {} in range: {}", siteId, range);
                return createEmptyResponse(siteId, range);
            }
            
            log.info("Found {} raw events for siteId: {}", rawEvents.size(), siteId);
            
            // Calculate metrics directly from raw events
            long totalPageviews = rawEvents.size();
            
            long totalVisitors = rawEvents.stream()
                    .map(RawEvent::getAnonId)
                    .distinct()
                    .count();
            
            // Calculate top pages (top 5)
            Map<String, Long> pageCounts = rawEvents.stream()
                    .collect(Collectors.groupingBy(RawEvent::getUrl, Collectors.counting()));
            
            List<AnalyticsSummaryResponse.PageCount> topPages = pageCounts.entrySet().stream()
                    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                    .limit(5)
                    .map(entry -> new AnalyticsSummaryResponse.PageCount(entry.getKey(), entry.getValue()))
                    .collect(Collectors.toList());
            
            // Calculate top countries (top 5)
            Map<String, Long> countryCounts = rawEvents.stream()
                    .filter(event -> event.getCountry() != null && !event.getCountry().isEmpty())
                    .collect(Collectors.groupingBy(RawEvent::getCountry, Collectors.counting()));
            
            List<AnalyticsSummaryResponse.CountryCount> topCountries = countryCounts.entrySet().stream()
                    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                    .limit(5)
                    .map(entry -> new AnalyticsSummaryResponse.CountryCount(entry.getKey(), entry.getValue()))
                    .collect(Collectors.toList());
            
            AnalyticsSummaryResponse response = new AnalyticsSummaryResponse(
                    siteId, range, totalVisitors, totalPageviews, topPages, topCountries, LocalDateTime.now()
            );
            
            log.info("Successfully created real-time analytics summary for siteId: {} with {} visitors and {} pageviews", 
                    siteId, totalVisitors, totalPageviews);
            
            return response;
            
        } catch (Exception e) {
            log.error("Error getting real-time analytics summary for siteId: {} and range: {}", siteId, range, e);
            throw new RuntimeException("Failed to get real-time analytics summary", e);
        }
    }
    
    private LocalDate calculateStartDate(LocalDate endDate, String range) {
        return switch (range.toLowerCase()) {
            case "7d" -> endDate.minusDays(6);
            case "1m" -> endDate.minusDays(29);
            case "30d" -> endDate.minusDays(29);
            case "1y" -> endDate.minusDays(364);
            case "5y" -> endDate.minusDays(1824);
            case "all" -> LocalDate.of(2020, 1, 1); // Far back date to get all data
            default -> throw new IllegalArgumentException("Invalid range: " + range + ". Supported values: 7d, 1m, 30d, 1y, 5y, all");
        };
    }
    
    private AnalyticsSummaryResponse createEmptyResponse(String siteId, String range) {
        return new AnalyticsSummaryResponse(siteId, range, 0L, 0L, List.of(), List.of(), LocalDateTime.now());
    }
}
