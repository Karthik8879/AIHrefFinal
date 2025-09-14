package com.aihref.repository;

import com.aihref.model.DailySnapshot;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailySnapshotRepository extends MongoRepository<DailySnapshot, String> {
    
    @Query("{ 'siteId': ?0, 'date': { $gte: ?1, $lte: ?2 } }")
    List<DailySnapshot> findBySiteIdAndDateBetween(String siteId, LocalDate startDate, LocalDate endDate);
    
    @Query("{ 'siteId': ?0, 'date': ?1 }")
    DailySnapshot findBySiteIdAndDate(String siteId, LocalDate date);
    
    @Query("{ 'siteId': ?0 }")
    List<DailySnapshot> findBySiteId(String siteId);
}
