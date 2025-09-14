package com.aihref.service;

import com.aihref.model.DailySnapshot;
import com.aihref.model.RawEvent;
import com.aihref.repository.DailySnapshotRepository;
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
public class AnalyticsAggregationService {
    
    private final RawEventRepository rawEventRepository;
    private final DailySnapshotRepository dailySnapshotRepository;
    
    public void aggregateDailyAnalytics() {
        log.info("Starting daily analytics aggregation at {}", LocalDateTime.now());
        
        try {
            // Get yesterday's date (since we run at midnight)
            LocalDate yesterday = LocalDate.now().minusDays(1);
            LocalDateTime startOfDay = yesterday.atStartOfDay();
            LocalDateTime endOfDay = yesterday.atTime(23, 59, 59);
            
            log.info("Aggregating data for date: {}", yesterday);
            
            // Get all raw events for yesterday
            List<RawEvent> rawEvents = rawEventRepository.findByTsBetween(startOfDay, endOfDay);
            
            // If no events found with timestamps, get all events (including null timestamps)
            if (rawEvents.isEmpty()) {
                log.info("No events found with timestamps, fetching all events for aggregation");
                rawEvents = rawEventRepository.findAll();
            }
            log.info("Found {} raw events for date {}", rawEvents.size(), yesterday);
            
            if (rawEvents.isEmpty()) {
                log.info("No raw events found for date {}, skipping aggregation", yesterday);
                return;
            }
            
            // Group events by siteId
            Map<String, List<RawEvent>> eventsBySite = rawEvents.stream()
                    .collect(Collectors.groupingBy(RawEvent::getSiteId));
            
            log.info("Processing {} sites: {}", eventsBySite.size(), eventsBySite.keySet());
            
            // Process each site
            for (Map.Entry<String, List<RawEvent>> entry : eventsBySite.entrySet()) {
                String siteId = entry.getKey();
                List<RawEvent> siteEvents = entry.getValue();
                
                log.info("Processing siteId: {} with {} events", siteId, siteEvents.size());
                
                // Check if snapshot already exists for this site and date
                DailySnapshot existingSnapshot = dailySnapshotRepository.findBySiteIdAndDate(siteId, yesterday);
                if (existingSnapshot != null) {
                    log.info("Snapshot already exists for siteId: {} and date: {}, skipping", siteId, yesterday);
                    continue;
                }
                
                // Create daily snapshot
                DailySnapshot snapshot = createDailySnapshot(siteId, yesterday, siteEvents);
                dailySnapshotRepository.save(snapshot);
                
                log.info("Successfully created snapshot for siteId: {} with {} visitors and {} pageviews", 
                        siteId, snapshot.getVisitors(), snapshot.getPageviews());
            }
            
            log.info("Daily analytics aggregation completed successfully");
            
        } catch (Exception e) {
            log.error("Error during daily analytics aggregation", e);
            throw new RuntimeException("Failed to aggregate daily analytics", e);
        }
    }
    
    private DailySnapshot createDailySnapshot(String siteId, LocalDate date, List<RawEvent> events) {
        // Calculate total pageviews
        long pageviews = events.size();
        
        // Calculate unique visitors
        long visitors = events.stream()
                .map(RawEvent::getAnonId)
                .distinct()
                .count();
        
        // Calculate top pages (top 5)
        List<DailySnapshot.PageCount> topPages = events.stream()
                .collect(Collectors.groupingBy(RawEvent::getUrl, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> new DailySnapshot.PageCount(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
        
        // Calculate top countries (top 5)
        List<DailySnapshot.CountryCount> topCountries = events.stream()
                .filter(event -> event.getCountry() != null && !event.getCountry().isEmpty())
                .collect(Collectors.groupingBy(RawEvent::getCountry, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> new DailySnapshot.CountryCount(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
        
        return new DailySnapshot(null, siteId, date, visitors, pageviews, topPages, topCountries);
    }
}
