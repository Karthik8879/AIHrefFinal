package com.aihref.service;

import com.aihref.dto.AIInsightsRequest;
import com.aihref.dto.AIInsightsResponse;
import com.aihref.dto.CombinedAnalyticsResponse;
import com.aihref.dto.EnhancedAnalyticsResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIAnalyticsService {
    
    private final GeminiService geminiService;
    private final EnhancedAnalyticsService enhancedAnalyticsService;
    private final CombinedAnalyticsService combinedAnalyticsService;
    
    public AIInsightsResponse generateInsights(AIInsightsRequest request) {
        try {
            log.info("Generating AI insights for siteId: {}", request.getSiteId());
            
            // Get analytics data
            EnhancedAnalyticsResponse analytics = enhancedAnalyticsService.getEnhancedAnalytics(
                    request.getSiteId(), request.getRange());
            
            if (analytics == null) {
                log.warn("No analytics data found for siteId: {}", request.getSiteId());
                return createErrorResponse(request.getSiteId(), request.getRange(), 
                        "No analytics data available for the specified site and time range.");
            }
            
            // Generate AI insights using Gemini
            String aiResponse = geminiService.generateInsights(analytics, request.getQuery(), request.getRange());
            
            // Parse and structure the response
            return parseAIResponse(aiResponse, request.getSiteId(), request.getRange(), analytics);
            
        } catch (Exception e) {
            log.error("Error generating insights for siteId: {}", request.getSiteId(), e);
            return createErrorResponse(request.getSiteId(), request.getRange(), 
                    "Error generating insights. Please try again later.");
        }
    }
    
    public AIInsightsResponse generateCombinedInsights(AIInsightsRequest request) {
        try {
            log.info("Generating combined AI insights for range: {}", request.getRange());
            
            // Get combined analytics data
            CombinedAnalyticsResponse analytics = combinedAnalyticsService.getCombinedAnalytics(request.getRange());
            
            if (analytics == null) {
                log.warn("No combined analytics data found for range: {}", request.getRange());
                return createErrorResponse(null, request.getRange(), 
                        "No analytics data available for the specified time range.");
            }
            
            // Generate AI insights using Gemini
            String aiResponse = geminiService.generateCombinedInsights(analytics, request.getQuery(), request.getRange());
            
            // Parse and structure the response
            return parseAIResponse(aiResponse, null, request.getRange(), analytics);
            
        } catch (Exception e) {
            log.error("Error generating combined insights for range: {}", request.getRange(), e);
            return createErrorResponse(null, request.getRange(), 
                    "Error generating insights. Please try again later.");
        }
    }
    
    private AIInsightsResponse parseAIResponse(String aiResponse, String siteId, String range, Object analytics) {
        AIInsightsResponse response = new AIInsightsResponse();
        response.setSiteId(siteId);
        response.setRange(range);
        response.setGeneratedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        
        // Parse the AI response into structured components
        String[] sections = aiResponse.split("\n\n");
        
        StringBuilder summary = new StringBuilder();
        List<String> keyInsights = new ArrayList<>();
        List<String> trends = new ArrayList<>();
        List<String> predictions = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();
        
        for (String section : sections) {
            String trimmedSection = section.trim();
            if (trimmedSection.isEmpty()) continue;
            
            if (trimmedSection.toLowerCase().contains("summary") || 
                trimmedSection.toLowerCase().contains("overview")) {
                summary.append(trimmedSection).append("\n");
            } else if (trimmedSection.toLowerCase().contains("insight") || 
                      trimmedSection.toLowerCase().contains("key finding")) {
                keyInsights.add(trimmedSection);
            } else if (trimmedSection.toLowerCase().contains("trend") || 
                      trimmedSection.toLowerCase().contains("pattern")) {
                trends.add(trimmedSection);
            } else if (trimmedSection.toLowerCase().contains("prediction") || 
                      trimmedSection.toLowerCase().contains("forecast")) {
                predictions.add(trimmedSection);
            } else if (trimmedSection.toLowerCase().contains("recommendation") || 
                      trimmedSection.toLowerCase().contains("suggestion")) {
                recommendations.add(trimmedSection);
            } else {
                // Default to key insights if no specific category
                keyInsights.add(trimmedSection);
            }
        }
        
        // If no specific sections found, treat the entire response as summary
        if (summary.length() == 0 && keyInsights.isEmpty()) {
            summary.append(aiResponse);
        }
        
        response.setSummary(summary.toString().trim());
        response.setKeyInsights(keyInsights);
        response.setTrends(trends);
        response.setPredictions(predictions);
        response.setRecommendations(recommendations);
        
        // Add metrics from analytics data
        Map<String, Object> metrics = new HashMap<>();
        if (analytics instanceof EnhancedAnalyticsResponse) {
            EnhancedAnalyticsResponse enhancedAnalytics = (EnhancedAnalyticsResponse) analytics;
            metrics.put("totalVisitorsTillDate", enhancedAnalytics.getTotalVisitorsTillDate());
            metrics.put("todayVisitors", enhancedAnalytics.getTodayVisitors());
            metrics.put("thisWeekVisitors", enhancedAnalytics.getThisWeekVisitors());
            metrics.put("thisMonthVisitors", enhancedAnalytics.getThisMonthVisitors());
            metrics.put("repeatVisitorsToday", enhancedAnalytics.getRepeatVisitorsToday());
        } else if (analytics instanceof CombinedAnalyticsResponse) {
            CombinedAnalyticsResponse combinedAnalytics = (CombinedAnalyticsResponse) analytics;
            metrics.put("totalVisitors", combinedAnalytics.getTotalVisitors());
            metrics.put("totalTodayVisitors", combinedAnalytics.getTotalTodayVisitors());
            metrics.put("totalWeekVisitors", combinedAnalytics.getTotalWeekVisitors());
            metrics.put("totalMonthVisitors", combinedAnalytics.getTotalMonthVisitors());
            metrics.put("totalRepeatVisitors", combinedAnalytics.getTotalRepeatVisitors());
            metrics.put("totalSites", combinedAnalytics.getSites().size());
        }
        response.setMetrics(metrics);
        
        return response;
    }
    
    private AIInsightsResponse createErrorResponse(String siteId, String range, String errorMessage) {
        AIInsightsResponse response = new AIInsightsResponse();
        response.setSiteId(siteId);
        response.setRange(range);
        response.setGeneratedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        response.setSummary(errorMessage);
        response.setKeyInsights(Arrays.asList("Unable to generate insights at this time"));
        response.setTrends(new ArrayList<>());
        response.setPredictions(new ArrayList<>());
        response.setRecommendations(new ArrayList<>());
        response.setMetrics(new HashMap<>());
        return response;
    }
}
