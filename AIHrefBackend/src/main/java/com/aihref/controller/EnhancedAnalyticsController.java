package com.aihref.controller;

import com.aihref.dto.EnhancedAnalyticsResponse;
import com.aihref.model.DailySnapshot;
import com.aihref.model.RawEvent;
import com.aihref.repository.DailySnapshotRepository;
import com.aihref.repository.RawEventRepository;
import com.aihref.service.EnhancedAnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"})
public class EnhancedAnalyticsController {
    
    private final EnhancedAnalyticsService enhancedAnalyticsService;
    private final DailySnapshotRepository dailySnapshotRepository;
    private final RawEventRepository rawEventRepository;
    
    @GetMapping("/enhanced")
    public ResponseEntity<EnhancedAnalyticsResponse> getEnhancedAnalytics(
            @RequestParam String siteId,
            @RequestParam(defaultValue = "7d") String range) {
        
        log.info("Received request for enhanced analytics - siteId: {}, range: {}", siteId, range);
        
        try {
            if (!isValidRange(range)) {
                log.warn("Invalid range parameter: {}", range);
                return ResponseEntity.badRequest().build();
            }
            
            EnhancedAnalyticsResponse response = enhancedAnalyticsService.getEnhancedAnalytics(siteId, range);
            log.info("Successfully processed enhanced analytics request");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error processing enhanced analytics request", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/daily-snapshots")
    public ResponseEntity<List<DailySnapshot>> getDailySnapshots(
            @RequestParam String siteId,
            @RequestParam(defaultValue = "7d") String range) {
        
        log.info("Received request for daily snapshots - siteId: {}, range: {}", siteId, range);
        
        try {
            if (!isValidRange(range)) {
                log.warn("Invalid range parameter: {}", range);
                return ResponseEntity.badRequest().build();
            }
            
            LocalDate endDate = LocalDate.now();
            LocalDate startDate = calculateStartDate(endDate, range);
            
            log.info("Querying daily snapshots for siteId: {} from {} to {}", siteId, startDate, endDate);
            
            List<DailySnapshot> snapshots = dailySnapshotRepository.findBySiteIdAndDateBetween(siteId, startDate, endDate);
            log.info("Found {} daily snapshots for siteId: {}", snapshots.size(), siteId);
            
            // If no snapshots found, return empty list instead of error
            if (snapshots.isEmpty()) {
                log.info("No daily snapshots found for siteId: {} in range: {}", siteId, range);
            }
            
            return ResponseEntity.ok(snapshots);
            
        } catch (Exception e) {
            log.error("Error fetching daily snapshots for siteId: {} range: {}", siteId, range, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/raw-events")
    public ResponseEntity<List<RawEvent>> getRawEvents(
            @RequestParam String siteId,
            @RequestParam(defaultValue = "7d") String range) {
        
        log.info("Received request for raw events - siteId: {}, range: {}", siteId, range);
        
        try {
            if (!isValidRange(range)) {
                log.warn("Invalid range parameter: {}", range);
                return ResponseEntity.badRequest().build();
            }
            
            LocalDate endDate = LocalDate.now();
            LocalDate startDate = calculateStartDate(endDate, range);
            
            // Convert LocalDate to LocalDateTime for the query
            LocalDateTime startDateTime = startDate.atStartOfDay();
            LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay();
            
            List<RawEvent> events = rawEventRepository.findBySiteIdAndTsBetween(siteId, startDateTime, endDateTime);
            log.info("Found {} raw events for siteId: {}", events.size(), siteId);
            
            return ResponseEntity.ok(events);
            
        } catch (Exception e) {
            log.error("Error fetching raw events", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    private boolean isValidRange(String range) {
        return "7d".equals(range) || "1m".equals(range) || "30d".equals(range) || 
               "1y".equals(range) || "5y".equals(range) || "all".equals(range);
    }
    
    private LocalDate calculateStartDate(LocalDate endDate, String range) {
        return switch (range) {
            case "7d" -> endDate.minusDays(7);
            case "1m", "30d" -> endDate.minusDays(30);
            case "1y" -> endDate.minusYears(1);
            case "5y" -> endDate.minusYears(5);
            case "all" -> LocalDate.of(2020, 1, 1); // Start from 2020 for "all"
            default -> endDate.minusDays(7);
        };
    }
}
