package com.aihref.controller;

import com.aihref.model.RawEvent;
import com.aihref.repository.RawEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class DebugController {
    
    private final RawEventRepository rawEventRepository;
    
    @GetMapping("/raw-events")
    public ResponseEntity<Map<String, Object>> getRawEventsInfo() {
        log.info("Getting raw events debug information");
        
        try {
            // Get total count
            long totalCount = rawEventRepository.count();
            
            // Get all raw events (limit to 10 for debugging)
            List<RawEvent> allEvents = rawEventRepository.findAll();
            List<RawEvent> limitedEvents = allEvents.stream().limit(10).toList();
            
            // Get unique siteIds
            List<String> uniqueSiteIds = allEvents.stream()
                    .map(RawEvent::getSiteId)
                    .distinct()
                    .toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("totalCount", totalCount);
            response.put("uniqueSiteIds", uniqueSiteIds);
            response.put("sampleEvents", limitedEvents);
            response.put("message", "Raw events debug information");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error getting raw events debug info", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to get raw events info: " + e.getMessage());
            
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @GetMapping("/raw-events/count")
    public ResponseEntity<Map<String, Object>> getRawEventsCount() {
        try {
            long count = rawEventRepository.count();
            
            Map<String, Object> response = new HashMap<>();
            response.put("count", count);
            response.put("message", "Total raw events count");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to get count: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
