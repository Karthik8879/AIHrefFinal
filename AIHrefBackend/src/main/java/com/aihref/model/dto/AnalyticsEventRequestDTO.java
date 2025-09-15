package com.aihref.model.dto;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsEventRequestDTO {
    
    @JsonProperty("siteId")
    private String siteId;
    
    @JsonProperty("eventType")
    private String eventType;
    
    @JsonProperty("anonId")
    private String anonId;
    
    @JsonProperty("url")
    private String url;
    
    @JsonProperty("referrer")
    private String referrer;
    
    @JsonProperty("userAgent")
    private String userAgent;
    
    @JsonProperty("ts")
    private Instant timestamp;
}
