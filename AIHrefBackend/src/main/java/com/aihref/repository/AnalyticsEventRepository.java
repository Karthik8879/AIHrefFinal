package com.aihref.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.aihref.model.Event;

@Repository
public class AnalyticsEventRepository {
    
    @Autowired
    @Qualifier("analyticsMongoTemplate")
    private MongoTemplate analyticsMongoTemplate;
    
    private static final String COLLECTION_NAME = "raw_events";
    
    public Event save(Event event) {
        return analyticsMongoTemplate.save(event, COLLECTION_NAME);
    }
    
    public List<Event> findBySiteIdAndEventType(String siteId, String eventType) {
        Query query = new Query(Criteria.where("siteId").is(siteId).and("eventType").is(eventType));
        return analyticsMongoTemplate.find(query, Event.class, COLLECTION_NAME);
    }
    
    public List<Event> findByAnonId(String anonId) {
        Query query = new Query(Criteria.where("anonId").is(anonId));
        return analyticsMongoTemplate.find(query, Event.class, COLLECTION_NAME);
    }
    
    public List<Event> findByTsBetween(Instant start, Instant end) {
        Query query = new Query(Criteria.where("ts").gte(start).lte(end));
        return analyticsMongoTemplate.find(query, Event.class, COLLECTION_NAME);
    }
    
    public List<Event> findBySiteIdAndTsBetween(String siteId, Instant start, Instant end) {
        Query query = new Query(Criteria.where("siteId").is(siteId).and("ts").gte(start).lte(end));
        return analyticsMongoTemplate.find(query, Event.class, COLLECTION_NAME);
    }
    
    public List<Event> findBySiteIdAndEventTypeAndTsBetween(String siteId, String eventType, Instant start, Instant end) {
        Query query = new Query(Criteria.where("siteId").is(siteId)
            .and("eventType").is(eventType)
            .and("ts").gte(start).lte(end));
        return analyticsMongoTemplate.find(query, Event.class, COLLECTION_NAME);
    }
    
    public long countBySiteIdAndEventType(String siteId, String eventType) {
        Query query = new Query(Criteria.where("siteId").is(siteId).and("eventType").is(eventType));
        return analyticsMongoTemplate.count(query, Event.class, COLLECTION_NAME);
    }
    
    public long countBySiteIdAndTsBetween(String siteId, Instant start, Instant end) {
        Query query = new Query(Criteria.where("siteId").is(siteId).and("ts").gte(start).lte(end));
        return analyticsMongoTemplate.count(query, Event.class, COLLECTION_NAME);
    }
    
    public List<Event> findBySiteId(String siteId) {
        Query query = new Query(Criteria.where("siteId").is(siteId));
        return analyticsMongoTemplate.find(query, Event.class, COLLECTION_NAME);
    }
}
