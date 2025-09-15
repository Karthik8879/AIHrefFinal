package com.aihref.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "raw_events")
public class Event {
    
    @Id
    private String id;
    
    @Indexed
    private String siteId;
    
    @Indexed
    private String eventType;
    
    @Indexed
    private String anonId;
    
    private String url;
    private String referrer;
    private String userAgent;
    
    @Indexed
    private Instant ts;
    
    private String country;
    private String city;
}
