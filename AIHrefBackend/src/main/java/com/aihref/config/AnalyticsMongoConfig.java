package com.aihref.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

import jakarta.annotation.PostConstruct;

@Configuration
public class AnalyticsMongoConfig {
    
    @Value("${spring.data.mongodb.uri}")
    private String mainMongoUri;
    
    @Value("${spring.data.mongodb.database}")
    private String mainDatabase;
    
    @Value("${analytics.mongodb.uri}")
    private String analyticsMongoUri;
    
    @Value("${analytics.mongodb.database}")
    private String analyticsDatabase;
    
    @PostConstruct
    public void logAnalyticsDatabaseConfig() {
        System.out.println("=== DATABASE CONFIGURATION ===");
        System.out.println("Main MongoDB URI: " + mainMongoUri);
        System.out.println("Main Database: " + mainDatabase);
        System.out.println("Analytics MongoDB URI: " + analyticsMongoUri);
        System.out.println("Analytics Database: " + analyticsDatabase);
        System.out.println("=========================================");
    }
    
    // Main MongoDB Configuration (for existing data)
    @Bean(name = "mongoClient")
    @Primary
    public MongoClient mongoClient() {
        return MongoClients.create(mainMongoUri);
    }
    
    @Bean(name = "mongoDatabaseFactory")
    @Primary
    public MongoDatabaseFactory mongoDatabaseFactory() {
        return new SimpleMongoClientDatabaseFactory(mongoClient(), mainDatabase);
    }
    
    @Bean(name = "mongoTemplate")
    @Primary
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoDatabaseFactory());
    }
    
    @Bean(name = "analyticsMongoClient")
    public MongoClient analyticsMongoClient() {
        return MongoClients.create(analyticsMongoUri);
    }
    
    @Bean(name = "analyticsMongoDatabaseFactory")
    public MongoDatabaseFactory analyticsMongoDatabaseFactory() {
        return new SimpleMongoClientDatabaseFactory(analyticsMongoClient(), analyticsDatabase);
    }
    
    @Bean(name = "analyticsMongoTemplate")
    public MongoTemplate analyticsMongoTemplate() {
        return new MongoTemplate(analyticsMongoDatabaseFactory());
    }
}
