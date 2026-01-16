package com.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/database")
    public ResponseEntity<String> testDatabaseConnection() {
        try {
            // Execute a simple command to test connection
            mongoTemplate.executeCommand("{ ping: 1 }");
            return ResponseEntity.ok("Database connection is working!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Database connection failed: " + e.getMessage());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<String> getApplicationStatus() {
        return ResponseEntity.ok("Application is running and database is configured");
    }
}
