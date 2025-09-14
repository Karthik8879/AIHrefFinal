package com.aihref.controller;

import com.aihref.service.AnalyticsAggregationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class AdminController {
    
    private final AnalyticsAggregationService analyticsAggregationService;
    
    @PostMapping("/trigger-aggregation")
    public ResponseEntity<Map<String, String>> triggerAggregation() {
        log.info("Manual aggregation triggered");
        
        try {
            analyticsAggregationService.aggregateDailyAnalytics();
            
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Analytics aggregation completed successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error during manual aggregation", e);
            
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Failed to aggregate analytics: " + e.getMessage());
            
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("message", "Admin API is working");
        return ResponseEntity.ok(response);
    }
}
