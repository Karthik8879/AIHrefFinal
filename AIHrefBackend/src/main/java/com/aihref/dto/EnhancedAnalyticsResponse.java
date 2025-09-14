package com.aihref.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnhancedAnalyticsResponse {
    
    private String siteId;
    private String range;
    
    // Traffic Summary
    private Long totalVisitorsTillDate;
    private Long todayVisitors;
    private Long thisWeekVisitors;
    private Long thisMonthVisitors;
    private Long repeatVisitorsToday;
    
    // Highest Performing Segments
    private String peakVisitDay;
    private Long peakVisitCount;
    private String topCountry;
    private String topSource;
    
    // Performance Over Time
    private Double avgVisitsPerDay;
    private Double avgVisitsPerWeek;
    private Double avgRepeatVisitorsPerDay;
    
    // Detailed Data
    private List<PageCount> topPages;
    private List<CountryCount> topCountries;
    private List<SourceCount> topSources;
    private List<LocationCount> topLocations;
    private List<DailyVisitorCount> dailyVisitorTrends;
    
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
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SourceCount {
        private String source;
        private Long count;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationCount {
        private String city;
        private String state;
        private String country;
        private Long count;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyVisitorCount {
        private LocalDate date;
        private Long visitors;
        private Long pageviews;
    }
}
