package com.aihref.service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeoLocationService {
    
    private static final Logger logger = LoggerFactory.getLogger(GeoLocationService.class);
    
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    
    public GeoLocationService() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }
    
    public Map<String, String> getLocationFromIp(String ipAddress) {
        Map<String, String> location = new HashMap<>();
        location.put("country", "Unknown");
        location.put("city", "Unknown");
        
        if (ipAddress == null || ipAddress.trim().isEmpty()) {
            logger.warn("IP address is null or empty");
            return location;
        }
        
        // Handle localhost and private IPs
        if (isLocalOrPrivateIp(ipAddress)) {
            location.put("country", "Local");
            location.put("city", "Local");
            return location;
        }
        
        try {
            // Use ip-api.com free service (no API key required, 1000 requests/minute)
            String apiUrl = "http://ip-api.com/json/" + ipAddress + "?fields=status,country,city";
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl))
                .timeout(java.time.Duration.ofSeconds(5))
                .build();
            
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() == 200) {
                JsonNode jsonNode = objectMapper.readTree(response.body());
                
                String status = jsonNode.get("status").asText();
                if ("success".equals(status)) {
                    String country = jsonNode.get("country").asText();
                    String city = jsonNode.get("city").asText();
                    
                    if (country != null && !country.isEmpty() && !country.equals("null")) {
                        location.put("country", country);
                    }
                    if (city != null && !city.isEmpty() && !city.equals("null")) {
                        location.put("city", city);
                    }
                    
                    logger.debug("Resolved IP {} to country: {}, city: {}", ipAddress, country, city);
                } else {
                    logger.warn("API returned error status: {}", status);
                }
            } else {
                logger.warn("API request failed with status: {}", response.statusCode());
            }
            
        } catch (Exception e) {
            logger.warn("Failed to resolve location for IP {}: {}", ipAddress, e.getMessage());
        }
        
        return location;
    }
    
    public boolean isGeoLocationAvailable() {
        return true; // API-based service is always available
    }
    
    private boolean isLocalOrPrivateIp(String ipAddress) {
        if (ipAddress == null) return true;
        
        // Check for localhost
        if (ipAddress.equals("127.0.0.1") || ipAddress.equals("::1") || ipAddress.equals("localhost")) {
            return true;
        }
        
        // Check for private IP ranges
        try {
            String[] parts = ipAddress.split("\\.");
            if (parts.length == 4) {
                int firstOctet = Integer.parseInt(parts[0]);
                int secondOctet = Integer.parseInt(parts[1]);
                
                // Private IP ranges
                if (firstOctet == 10) return true;
                if (firstOctet == 172 && secondOctet >= 16 && secondOctet <= 31) return true;
                if (firstOctet == 192 && secondOctet == 168) return true;
            }
        } catch (Exception e) {
            return true; // Treat invalid IPs as local
        }
        
        return false;
    }
}
