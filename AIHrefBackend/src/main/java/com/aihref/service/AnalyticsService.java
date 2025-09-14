package com.aihref.service;

import com.aihref.dto.AnalyticsSummaryResponse;
import com.aihref.model.DailySnapshot;
import com.aihref.repository.DailySnapshotRepository;
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
public class AnalyticsService {
    
    private final DailySnapshotRepository dailySnapshotRepository;
    
    public AnalyticsSummaryResponse getAnalyticsSummary(String siteId, String range) {
        log.info("Getting analytics summary for siteId: {} and range: {}", siteId, range);
        
        try {
            LocalDate endDate = LocalDate.now(); // Today
            LocalDate startDate = calculateStartDate(endDate, range);
            
            log.info("Fetching snapshots for siteId: {} from {} to {}", siteId, startDate, endDate);
            
            List<DailySnapshot> snapshots = dailySnapshotRepository.findBySiteIdAndDateBetween(siteId, startDate, endDate);
            
            if (snapshots.isEmpty()) {
                log.info("No snapshots found for siteId: {} in range: {}", siteId, range);
                return createEmptyResponse(siteId, range);
            }
            
            log.info("Found {} snapshots for siteId: {}", snapshots.size(), siteId);
            
            // Aggregate data from snapshots
            long totalVisitors = snapshots.stream()
                    .mapToLong(DailySnapshot::getVisitors)
                    .sum();
            
            long totalPageviews = snapshots.stream()
                    .mapToLong(DailySnapshot::getPageviews)
                    .sum();
            
            // Aggregate top pages across all snapshots
            Map<String, Long> pageCounts = snapshots.stream()
                    .flatMap(snapshot -> snapshot.getTopPages().stream())
                    .collect(Collectors.groupingBy(
                            DailySnapshot.PageCount::getUrl,
                            Collectors.summingLong(DailySnapshot.PageCount::getCount)
                    ));
            
            List<AnalyticsSummaryResponse.PageCount> topPages = pageCounts.entrySet().stream()
                    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                    .limit(5)
                    .map(entry -> new AnalyticsSummaryResponse.PageCount(entry.getKey(), entry.getValue()))
                    .collect(Collectors.toList());
            
            // Aggregate top countries across all snapshots
            Map<String, Long> countryCounts = snapshots.stream()
                    .flatMap(snapshot -> snapshot.getTopCountries().stream())
                    .collect(Collectors.groupingBy(
                            DailySnapshot.CountryCount::getCountry,
                            Collectors.summingLong(DailySnapshot.CountryCount::getCount)
                    ));
            
            List<AnalyticsSummaryResponse.CountryCount> topCountries = countryCounts.entrySet().stream()
                    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                    .limit(5)
                    .map(entry -> new AnalyticsSummaryResponse.CountryCount(entry.getKey(), entry.getValue()))
                    .collect(Collectors.toList());
            
            // Get the most recent snapshot's date as lastUpdated
            LocalDateTime lastUpdated = snapshots.stream()
                    .map(DailySnapshot::getDate)
                    .max(LocalDate::compareTo)
                    .map(date -> date.atStartOfDay())
                    .orElse(LocalDateTime.now());
            
            AnalyticsSummaryResponse response = new AnalyticsSummaryResponse(
                    siteId, range, totalVisitors, totalPageviews, topPages, topCountries, lastUpdated
            );
            
            log.info("Successfully created analytics summary for siteId: {} with {} visitors and {} pageviews", 
                    siteId, totalVisitors, totalPageviews);
            
            return response;
            
        } catch (Exception e) {
            log.error("Error getting analytics summary for siteId: {} and range: {}", siteId, range, e);
            throw new RuntimeException("Failed to get analytics summary", e);
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
