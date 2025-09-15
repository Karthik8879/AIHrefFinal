package com.aihref.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "gemini")
public class GeminiConfig {
    private String apiKey;
    private String modelName = "gemini-1.5-flash";
    private int maxTokens = 2048;
    private double temperature = 0.7;
}
