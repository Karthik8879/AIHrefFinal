package com.aihref.scheduler;

import com.aihref.service.AnalyticsAggregationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AnalyticsScheduler {
    
    private final AnalyticsAggregationService analyticsAggregationService;
    
    @Scheduled(cron = "0 0 0 * * *") // Runs every day at midnight
    public void runDailyAnalyticsAggregation() {
        log.info("Scheduled job triggered for daily analytics aggregation");
        try {
            analyticsAggregationService.aggregateDailyAnalytics();
            log.info("Scheduled job completed successfully");
        } catch (Exception e) {
            log.error("Scheduled job failed", e);
        }
    }
}
