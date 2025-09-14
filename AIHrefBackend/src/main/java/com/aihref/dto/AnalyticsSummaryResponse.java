package com.aihref.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsSummaryResponse {
    
    private String siteId;
    private String range;
    private Long visitors;
    private Long pageviews;
    private List<PageCount> topPages;
    private List<CountryCount> topCountries;
    private LocalDateTime lastUpdated;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PageCount {
        private String url;
        private Long count;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CountryCount {
        private String country;
        private Long count;
    }
}
