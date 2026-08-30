package com.tourtec.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public Map<String, Object> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "OK");
        health.put("platform", "TOURTEC INDIA - Incredible India Smart Tourism Spring Boot Backend");
        health.put("framework", "Spring Boot 3.2.5 (Java 17/21/25)");
        health.put("version", "2.5.0-SPRING-STS");
        health.put("timestamp", Instant.now().toString());
        health.put("regionsActive", 5);
        health.put("geospatialEngine", "Active");
        health.put("telemetryMesh", "Connected");
        return health;
    }
}
