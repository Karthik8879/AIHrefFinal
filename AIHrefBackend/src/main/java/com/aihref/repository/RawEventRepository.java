package com.aihref.repository;

import com.aihref.model.RawEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RawEventRepository extends MongoRepository<RawEvent, String> {
    
    @Query("{ 'siteId': ?0, 'ts': { $gte: ?1, $lt: ?2 } }")
    List<RawEvent> findBySiteIdAndTsBetween(String siteId, LocalDateTime start, LocalDateTime end);
    
    @Query("{ 'ts': { $gte: ?0, $lt: ?1 } }")
    List<RawEvent> findByTsBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("{ 'siteId': ?0 }")
    List<RawEvent> findBySiteId(String siteId);
    
    @Query("{ 'siteId': ?0, 'ts': { $gte: ?1, $lt: ?2 } }")
    List<RawEvent> findBySiteIdAndTsBetween(String siteId, LocalDate start, LocalDate end);
    
    // Legacy method names for backward compatibility
    @Query("{ 'siteId': ?0, 'ts': { $gte: ?1, $lt: ?2 } }")
    List<RawEvent> findBySiteIdAndTimestampBetween(String siteId, LocalDateTime start, LocalDateTime end);
    
    @Query("{ 'ts': { $gte: ?0, $lt: ?1 } }")
    List<RawEvent> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
}
