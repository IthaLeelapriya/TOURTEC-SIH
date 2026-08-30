package com.tourtec.model;

import java.util.List;
import java.util.Map;

public class RoadmapOptimizationRequest {
    private String destinationId;
    private List<Map<String, Object>> currentStops;
    private Map<String, Object> userPreferences;

    public RoadmapOptimizationRequest() {}

    public String getDestinationId() { return destinationId; }
    public void setDestinationId(String destinationId) { this.destinationId = destinationId; }

    public List<Map<String, Object>> getCurrentStops() { return currentStops; }
    public void setCurrentStops(List<Map<String, Object>> currentStops) { this.currentStops = currentStops; }

    public Map<String, Object> getUserPreferences() { return userPreferences; }
    public void setUserPreferences(Map<String, Object> userPreferences) { this.userPreferences = userPreferences; }
}
