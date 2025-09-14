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
            // Get all raw events (not just yesterday's)
            List<RawEvent> allRawEvents = rawEventRepository.findAll();
            log.info("Found {} total raw events for aggregation", allRawEvents.size());
            
            if (allRawEvents.isEmpty()) {
                log.info("No raw events found, skipping aggregation");
                return;
            }
            
            // Group events by siteId and date
            Map<String, Map<LocalDate, List<RawEvent>>> eventsBySiteAndDate = allRawEvents.stream()
                    .filter(event -> event.getTs() != null) // Only process events with timestamps
                    .collect(Collectors.groupingBy(
                            RawEvent::getSiteId,
                            Collectors.groupingBy(event -> event.getTs().toLocalDate())
                    ));
            
            log.info("Processing {} sites with data", eventsBySiteAndDate.size());
            
            int totalSnapshotsCreated = 0;
            
            // Process each site and date combination
            for (Map.Entry<String, Map<LocalDate, List<RawEvent>>> siteEntry : eventsBySiteAndDate.entrySet()) {
                String siteId = siteEntry.getKey();
                Map<LocalDate, List<RawEvent>> eventsByDate = siteEntry.getValue();
                
                log.info("Processing siteId: {} with {} different dates", siteId, eventsByDate.size());
                
                for (Map.Entry<LocalDate, List<RawEvent>> dateEntry : eventsByDate.entrySet()) {
                    LocalDate date = dateEntry.getKey();
                    List<RawEvent> siteEvents = dateEntry.getValue();
                    
                    log.info("Processing siteId: {} for date: {} with {} events", siteId, date, siteEvents.size());
                    
                    // Check if snapshot already exists for this site and date
                    DailySnapshot existingSnapshot = dailySnapshotRepository.findBySiteIdAndDate(siteId, date);
                    if (existingSnapshot != null) {
                        log.info("Snapshot already exists for siteId: {} and date: {}, skipping", siteId, date);
                        continue;
                    }
                    
                    // Create daily snapshot
                    DailySnapshot snapshot = createDailySnapshot(siteId, date, siteEvents);
                    dailySnapshotRepository.save(snapshot);
                    totalSnapshotsCreated++;
                    
                    log.info("Successfully created snapshot for siteId: {} date: {} with {} visitors and {} pageviews", 
                            siteId, date, snapshot.getVisitors(), snapshot.getPageviews());
                }
            }
            
            log.info("Daily analytics aggregation completed successfully. Created {} new snapshots", totalSnapshotsCreated);
            
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
