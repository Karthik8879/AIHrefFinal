package com.aihref.service;

import com.aihref.config.GeminiConfig;
import com.aihref.dto.CombinedAnalyticsResponse;
import com.aihref.dto.EnhancedAnalyticsResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService {
    
    private final GeminiConfig geminiConfig;
    private final ObjectMapper objectMapper;
    
    private WebClient getWebClient() {
        return WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
    
    public String generateInsights(EnhancedAnalyticsResponse analytics, String query, String range) {
        try {
            String prompt = buildAnalyticsPrompt(analytics, query, range);
            return callGeminiAPI(prompt);
        } catch (Exception e) {
            log.error("Error generating insights with Gemini", e);
            return "Unable to generate AI insights at this time. Please try again later.";
        }
    }
    
    public String generateCombinedInsights(CombinedAnalyticsResponse analytics, String query, String range) {
        try {
            String prompt = buildCombinedAnalyticsPrompt(analytics, query, range);
            return callGeminiAPI(prompt);
        } catch (Exception e) {
            log.error("Error generating combined insights with Gemini", e);
            return "Unable to generate AI insights at this time. Please try again later.";
        }
    }
    
    private String buildAnalyticsPrompt(EnhancedAnalyticsResponse analytics, String query, String range) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are an expert web analytics consultant. Analyze the following website analytics data and provide insights.\n\n");
        
        prompt.append("ANALYTICS DATA:\n");
        prompt.append("Time Range: ").append(range).append("\n");
        prompt.append("Total Visitors Till Date: ").append(analytics.getTotalVisitorsTillDate()).append("\n");
        prompt.append("Today Visitors: ").append(analytics.getTodayVisitors()).append("\n");
        prompt.append("This Week Visitors: ").append(analytics.getThisWeekVisitors()).append("\n");
        prompt.append("This Month Visitors: ").append(analytics.getThisMonthVisitors()).append("\n");
        prompt.append("Repeat Visitors Today: ").append(analytics.getRepeatVisitorsToday()).append("\n\n");
        
        if (analytics.getTopPages() != null && !analytics.getTopPages().isEmpty()) {
            prompt.append("TOP PAGES:\n");
            analytics.getTopPages().forEach(page -> 
                prompt.append("- ").append(page.getUrl()).append(" (").append(page.getCount()).append(" views)\n"));
            prompt.append("\n");
        }
        
        if (analytics.getTopCountries() != null && !analytics.getTopCountries().isEmpty()) {
            prompt.append("TOP COUNTRIES:\n");
            analytics.getTopCountries().forEach(country -> 
                prompt.append("- ").append(country.getCountry()).append(" (").append(country.getCount()).append(" visitors)\n"));
            prompt.append("\n");
        }
        
        if (analytics.getTopSources() != null && !analytics.getTopSources().isEmpty()) {
            prompt.append("TOP TRAFFIC SOURCES:\n");
            analytics.getTopSources().forEach(source -> 
                prompt.append("- ").append(source.getSource()).append(" (").append(source.getCount()).append(" visitors)\n"));
            prompt.append("\n");
        }
        
        if (analytics.getDailyVisitorTrends() != null && !analytics.getDailyVisitorTrends().isEmpty()) {
            prompt.append("DAILY VISITOR TRENDS:\n");
            analytics.getDailyVisitorTrends().forEach(trend -> 
                prompt.append("- ").append(trend.getDate()).append(": ").append(trend.getVisitors()).append(" visitors\n"));
            prompt.append("\n");
        }
        
        prompt.append("USER QUERY: ").append(query).append("\n\n");
        
        prompt.append("Please provide:\n");
        prompt.append("1. A brief summary of the website's performance\n");
        prompt.append("2. Key insights and trends\n");
        prompt.append("3. Actionable recommendations\n");
        prompt.append("4. Potential areas for improvement\n");
        prompt.append("5. Predictions for future performance based on current trends\n\n");
        prompt.append("Format your response in a clear, professional manner suitable for business stakeholders.");
        
        return prompt.toString();
    }
    
    private String buildCombinedAnalyticsPrompt(CombinedAnalyticsResponse analytics, String query, String range) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are an expert web analytics consultant. Analyze the following combined analytics data from multiple websites and provide insights.\n\n");
        
        prompt.append("COMBINED ANALYTICS DATA:\n");
        prompt.append("Time Range: ").append(range).append("\n");
        prompt.append("Total Sites: ").append(analytics.getSites().size()).append("\n");
        prompt.append("Total Visitors: ").append(analytics.getTotalVisitors()).append("\n");
        prompt.append("Total Today Visitors: ").append(analytics.getTotalTodayVisitors()).append("\n");
        prompt.append("Total Week Visitors: ").append(analytics.getTotalWeekVisitors()).append("\n");
        prompt.append("Total Month Visitors: ").append(analytics.getTotalMonthVisitors()).append("\n");
        prompt.append("Total Repeat Visitors: ").append(analytics.getTotalRepeatVisitors()).append("\n\n");
        
        prompt.append("SITE BREAKDOWN:\n");
        analytics.getSites().forEach(site -> {
            prompt.append("- ").append(site.getSiteId()).append(": ")
                  .append(site.getVisitors()).append(" visitors, ")
                  .append(site.getTodayVisitors()).append(" today visitors\n");
        });
        prompt.append("\n");
        
        if (analytics.getTopPages() != null && !analytics.getTopPages().isEmpty()) {
            prompt.append("TOP PAGES ACROSS ALL SITES:\n");
            analytics.getTopPages().forEach(page -> 
                prompt.append("- ").append(page.getPage()).append(" (").append(page.getCount()).append(" views)\n"));
            prompt.append("\n");
        }
        
        if (analytics.getTopCountries() != null && !analytics.getTopCountries().isEmpty()) {
            prompt.append("TOP COUNTRIES ACROSS ALL SITES:\n");
            analytics.getTopCountries().forEach(country -> 
                prompt.append("- ").append(country.getCountry()).append(" (").append(country.getCount()).append(" visitors)\n"));
            prompt.append("\n");
        }
        
        if (analytics.getTopSources() != null && !analytics.getTopSources().isEmpty()) {
            prompt.append("TOP TRAFFIC SOURCES ACROSS ALL SITES:\n");
            analytics.getTopSources().forEach(source -> 
                prompt.append("- ").append(source.getSource()).append(" (").append(source.getCount()).append(" visitors)\n"));
            prompt.append("\n");
        }
        
        if (analytics.getDailyVisitors() != null && !analytics.getDailyVisitors().isEmpty()) {
            prompt.append("DAILY VISITOR TRENDS ACROSS ALL SITES:\n");
            analytics.getDailyVisitors().forEach(trend -> 
                prompt.append("- ").append(trend.getDate()).append(": ").append(trend.getVisitors()).append(" visitors\n"));
            prompt.append("\n");
        }
        
        prompt.append("USER QUERY: ").append(query).append("\n\n");
        
        prompt.append("Please provide:\n");
        prompt.append("1. A comprehensive summary of the portfolio's performance\n");
        prompt.append("2. Cross-site insights and comparisons\n");
        prompt.append("3. Key trends and patterns\n");
        prompt.append("4. Strategic recommendations for the entire portfolio\n");
        prompt.append("5. Predictions for future performance\n");
        prompt.append("6. Opportunities for cross-site optimization\n\n");
        prompt.append("Format your response in a clear, professional manner suitable for business stakeholders.");
        
        return prompt.toString();
    }
    
    private String callGeminiAPI(String prompt) {
        try {
            // Check if API key is configured
            if (geminiConfig.getApiKey() == null || geminiConfig.getApiKey().trim().isEmpty() || 
                geminiConfig.getApiKey().equals("your-gemini-api-key-here")) {
                log.warn("Gemini API key not configured properly, returning mock response");
                return generateMockResponse(prompt);
            }
            
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, Object> part = new HashMap<>();
            
            part.put("text", prompt);
            content.put("parts", new Object[]{part});
            requestBody.put("contents", new Object[]{content});
            
            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("temperature", geminiConfig.getTemperature());
            generationConfig.put("maxOutputTokens", geminiConfig.getMaxTokens());
            requestBody.put("generationConfig", generationConfig);
            
            String url = String.format("/models/%s:generateContent?key=%s", 
                    geminiConfig.getModelName(), geminiConfig.getApiKey());
            
            log.info("Calling Gemini API with URL: {}", url);
            
            WebClient webClient = getWebClient();
            Mono<Map> response = webClient.post()
                    .uri(url)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class);
            
            Map result = response.block();
            
            if (result != null && result.containsKey("candidates")) {
                Object[] candidates = (Object[]) result.get("candidates");
                if (candidates.length > 0) {
                    Map candidate = (Map) candidates[0];
                    Map content2 = (Map) candidate.get("content");
                    Object[] parts = (Object[]) content2.get("parts");
                    if (parts.length > 0) {
                        Map part2 = (Map) parts[0];
                        return (String) part2.get("text");
                    }
                }
            }
            
            log.warn("Unexpected response format from Gemini API: {}", result);
            return "Unable to generate insights at this time.";
            
        } catch (Exception e) {
            log.error("Error calling Gemini API", e);
            return "Error generating insights. Please try again later.";
        }
    }
    
    private String generateMockResponse(String prompt) {
        StringBuilder response = new StringBuilder();
        response.append("## AI Analytics Summary\n\n");
        response.append("Based on your analytics data, here are the key insights:\n\n");
        response.append("### Key Insights\n");
        response.append("• Your website is showing positive growth trends\n");
        response.append("• User engagement metrics are within expected ranges\n");
        response.append("• Traffic sources are diversified across multiple channels\n\n");
        response.append("### Trends\n");
        response.append("• Visitor count has been stable over the selected period\n");
        response.append("• Page views show consistent patterns\n");
        response.append("• Session duration indicates good user engagement\n\n");
        response.append("### Predictions\n");
        response.append("• Based on current trends, expect continued growth\n");
        response.append("• User engagement is likely to remain stable\n");
        response.append("• Traffic patterns suggest seasonal consistency\n\n");
        response.append("### Recommendations\n");
        response.append("• Continue monitoring key performance indicators\n");
        response.append("• Focus on optimizing high-performing pages\n");
        response.append("• Consider expanding successful traffic sources\n\n");
        response.append("**Note**: This is a mock response. Configure your Gemini API key for real AI insights.");
        
        return response.toString();
    }
}
