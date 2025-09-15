package com.aihref.controller;

import com.aihref.dto.AIInsightsRequest;
import com.aihref.dto.AIInsightsResponse;
import com.aihref.dto.CombinedAnalyticsResponse;
import com.aihref.dto.EnhancedAnalyticsResponse;
import com.aihref.service.AIAnalyticsService;
import com.aihref.service.CombinedAnalyticsService;
import com.aihref.service.EnhancedAnalyticsService;
import com.aihref.config.GeminiConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai-analytics")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"})
public class AIAnalyticsController {
    
    private final AIAnalyticsService aiAnalyticsService;
    private final EnhancedAnalyticsService enhancedAnalyticsService;
    private final CombinedAnalyticsService combinedAnalyticsService;
    private final GeminiConfig geminiConfig;
    
    @PostMapping("/insights")
    public ResponseEntity<AIInsightsResponse> getAIInsights(@RequestBody AIInsightsRequest request) {
        log.info("Received AI insights request - siteId: {}, range: {}, query: {}", 
                request.getSiteId(), request.getRange(), request.getQuery());
        
        try {
            if (request.getSiteId() == null || request.getSiteId().trim().isEmpty()) {
                log.warn("Invalid siteId parameter");
                return ResponseEntity.badRequest().build();
            }
            
            if (!isValidRange(request.getRange())) {
                log.warn("Invalid range parameter: {}", request.getRange());
                return ResponseEntity.badRequest().build();
            }
            
            AIInsightsResponse response = aiAnalyticsService.generateInsights(request);
            log.info("Successfully generated AI insights for siteId: {}", request.getSiteId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error generating AI insights", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/combined-insights")
    public ResponseEntity<AIInsightsResponse> getCombinedAIInsights(@RequestBody AIInsightsRequest request) {
        log.info("Received combined AI insights request - range: {}, query: {}", 
                request.getRange(), request.getQuery());
        
        try {
            if (!isValidRange(request.getRange())) {
                log.warn("Invalid range parameter: {}", request.getRange());
                return ResponseEntity.badRequest().build();
            }
            
            AIInsightsResponse response = aiAnalyticsService.generateCombinedInsights(request);
            log.info("Successfully generated combined AI insights");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error generating combined AI insights", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/quick-insights/{siteId}")
    public ResponseEntity<AIInsightsResponse> getQuickInsights(
            @PathVariable String siteId,
            @RequestParam(defaultValue = "7d") String range) {
        
        log.info("Received quick insights request - siteId: {}, range: {}", siteId, range);
        
        try {
            if (!isValidRange(range)) {
                log.warn("Invalid range parameter: {}", range);
                return ResponseEntity.badRequest().build();
            }
            
            AIInsightsRequest request = new AIInsightsRequest(siteId, range, 
                    "Provide a quick overview of website performance and key insights", true, true);
            
            AIInsightsResponse response = aiAnalyticsService.generateInsights(request);
            log.info("Successfully generated quick insights for siteId: {}", siteId);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error generating quick insights", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/combined-quick-insights")
    public ResponseEntity<AIInsightsResponse> getCombinedQuickInsights(
            @RequestParam(defaultValue = "7d") String range) {
        
        log.info("Received combined quick insights request - range: {}", range);
        
        try {
            if (!isValidRange(range)) {
                log.warn("Invalid range parameter: {}", range);
                return ResponseEntity.badRequest().build();
            }
            
            AIInsightsRequest request = new AIInsightsRequest(null, range, 
                    "Provide a quick overview of portfolio performance and key insights across all websites", true, true);
            
            AIInsightsResponse response = aiAnalyticsService.generateCombinedInsights(request);
            log.info("Successfully generated combined quick insights");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error generating combined quick insights", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ok");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("message", "AI Analytics service is running");
        response.put("geminiConfigured", geminiConfig.getApiKey() != null && !geminiConfig.getApiKey().equals("your-gemini-api-key-here"));
        return ResponseEntity.ok(response);
    }
    
    private boolean isValidRange(String range) {
        return "7d".equals(range) || "1m".equals(range) || "30d".equals(range) || 
               "1y".equals(range) || "5y".equals(range) || "all".equals(range);
    }
}
