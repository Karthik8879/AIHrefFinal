package com.aihref.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIInsightsRequest {
    private String siteId;
    private String range;
    private String query;
    private boolean includeTrends;
    private boolean includePredictions;
}
