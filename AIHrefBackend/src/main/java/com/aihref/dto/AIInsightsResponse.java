package com.aihref.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIInsightsResponse {
    private String summary;
    private List<String> keyInsights;
    private List<String> trends;
    private List<String> predictions;
    private List<String> recommendations;
    private Map<String, Object> metrics;
    private String generatedAt;
    private String siteId;
    private String range;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrendAnalysis {
        private String trendType;
        private String description;
        private double changePercentage;
        private String direction; // "up", "down", "stable"
        private String confidence; // "high", "medium", "low"
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Prediction {
        private String metric;
        private String timeframe;
        private String prediction;
        private String confidence;
        private String reasoning;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Recommendation {
        private String category;
        private String title;
        private String description;
        private String priority; // "high", "medium", "low"
        private String impact;
    }
}
