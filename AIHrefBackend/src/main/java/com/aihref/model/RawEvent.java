package com.aihref.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "raw_events")
public class RawEvent {
    
    @Id
    private String id;
    
    @Field("siteId")
    private String siteId;
    
    @Field("eventType")
    private String eventType;
    
    @Field("anonId")
    private String anonId;
    
    @Field("url")
    private String url;
    
    @Field("referrer")
    private String referrer;
    
    @Field("userAgent")
    private String userAgent;
    
    @Field("ts")
    private LocalDateTime ts;
    
    @Field("country")
    private String country;
    
    @Field("city")
    private String city;
}
