package com.aihref.controller;

import com.aihref.dto.AnalyticsSummaryResponse;
import com.aihref.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class AnalyticsController {
    
    private final AnalyticsService analyticsService;
    
    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryResponse> getAnalyticsSummary(
            @RequestParam String siteId,
            @RequestParam(defaultValue = "7d") String range) {
        
        log.info("Received request for analytics summary - siteId: {}, range: {}", siteId, range);
        
        try {
            // Validate range parameter
            if (!isValidRange(range)) {
                log.warn("Invalid range parameter: {}", range);
                return ResponseEntity.badRequest().build();
            }
            
            AnalyticsSummaryResponse response = analyticsService.getAnalyticsSummary(siteId, range);
            log.info("Successfully processed analytics summary request");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error processing analytics summary request", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    private boolean isValidRange(String range) {
        return "7d".equals(range) || "30d".equals(range) || "all".equals(range);
    }
}
