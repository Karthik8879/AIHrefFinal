package com.aihref.controller;

import java.time.Instant;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aihref.model.Event;
import com.aihref.model.dto.AnalyticsEventRequestDTO;
import com.aihref.repository.AnalyticsEventRepository;
import com.aihref.service.GeoLocationService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ingest")
@CrossOrigin(origins = "*")
public class AnalyticsController {
    
    private static final Logger logger = LoggerFactory.getLogger(AnalyticsController.class);
    
    @Autowired
    private AnalyticsEventRepository analyticsEventRepository;
    
    @Autowired
    private GeoLocationService geoLocationService;
    
    @PostMapping("/event")
    public ResponseEntity<Map<String, String>> ingestEvent(
            @Valid @RequestBody AnalyticsEventRequestDTO eventRequest,
            HttpServletRequest request) {
        
        try {
            // Extract client IP address
            String clientIp = getClientIpAddress(request);
            logger.debug("Processing analytics event from IP: {}", clientIp);
            
            // Get geo location data
            Map<String, String> location = geoLocationService.getLocationFromIp(clientIp);
            String country = location.get("country");
            String city = location.get("city");
            
            // Create analytics event entity
            Event event = new Event();
            event.setSiteId(eventRequest.getSiteId());
            event.setEventType(eventRequest.getEventType());
            event.setAnonId(eventRequest.getAnonId());
            event.setUrl(eventRequest.getUrl());
            event.setReferrer(eventRequest.getReferrer());
            event.setUserAgent(eventRequest.getUserAgent());
            event.setTs(eventRequest.getTimestamp() != null ? eventRequest.getTimestamp() : Instant.now());
            event.setCountry(country);
            event.setCity(city);
            
            // Save to Analytics MongoDB
            Event savedEvent = analyticsEventRepository.save(event);
            logger.info("Analytics event saved with ID: {} for siteId: {}, eventType: {}", 
                       savedEvent.getId(), eventRequest.getSiteId(), eventRequest.getEventType());
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Event ingested successfully",
                "eventId", savedEvent.getId()
            ));
            
        } catch (Exception e) {
            logger.error("Error processing analytics event: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "status", "error",
                    "message", "Failed to process analytics event"
                ));
        }
    }
    
    /**
     * Extract client IP address from HttpServletRequest
     * Handles X-Forwarded-For header for load balancers/proxies
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            // X-Forwarded-For can contain multiple IPs, take the first one
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}
