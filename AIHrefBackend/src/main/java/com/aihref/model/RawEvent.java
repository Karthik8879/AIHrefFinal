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
    
    @Field("url")
    private String url;
    
    @Field("referrer")
    private String referrer;
    
    @Field("country")
    private String country;
    
    @Field("timestamp")
    private LocalDateTime timestamp;
    
    @Field("anonId")
    private String anonId;
}
