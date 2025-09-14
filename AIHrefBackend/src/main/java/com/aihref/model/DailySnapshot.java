package com.aihref.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "daily_snapshots")
public class DailySnapshot {
    
    @Id
    private String id;
    
    @Field("siteId")
    private String siteId;
    
    @Field("date")
    private LocalDate date;
    
    @Field("visitors")
    private Long visitors;
    
    @Field("pageviews")
    private Long pageviews;
    
    @Field("topPages")
    private List<PageCount> topPages;
    
    @Field("topCountries")
    private List<CountryCount> topCountries;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PageCount {
        @Field("url")
        private String url;
        
        @Field("count")
        private Long count;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CountryCount {
        @Field("country")
        private String country;
        
        @Field("count")
        private Long count;
    }
}
