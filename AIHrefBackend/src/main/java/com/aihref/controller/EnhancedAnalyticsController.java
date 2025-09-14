package com.aihref.controller;

import com.aihref.dto.EnhancedAnalyticsResponse;
import com.aihref.service.EnhancedAnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class EnhancedAnalyticsController {
    
    private final EnhancedAnalyticsService enhancedAnalyticsService;
    
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
    
    private boolean isValidRange(String range) {
        return "7d".equals(range) || "1m".equals(range) || "30d".equals(range) || 
               "1y".equals(range) || "5y".equals(range) || "all".equals(range);
    }
}
