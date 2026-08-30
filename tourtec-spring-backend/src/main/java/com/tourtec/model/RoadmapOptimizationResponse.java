package com.tourtec.model;

import java.util.List;
import java.util.Map;

public class RoadmapOptimizationResponse {
    private boolean success;
    private String destinationId;
    private List<Map<String, Object>> optimizedSequence;
    private int timeSavedMinutes;
    private double carbonOffsetKg;
    private int ecoPointsAwarded;
    private String message;

    public RoadmapOptimizationResponse() {}

    public RoadmapOptimizationResponse(boolean success, String destinationId, List<Map<String, Object>> optimizedSequence, int timeSavedMinutes, double carbonOffsetKg, int ecoPointsAwarded, String message) {
        this.success = success;
        this.destinationId = destinationId;
        this.optimizedSequence = optimizedSequence;
        this.timeSavedMinutes = timeSavedMinutes;
        this.carbonOffsetKg = carbonOffsetKg;
        this.ecoPointsAwarded = ecoPointsAwarded;
        this.message = message;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getDestinationId() { return destinationId; }
    public void setDestinationId(String destinationId) { this.destinationId = destinationId; }

    public List<Map<String, Object>> getOptimizedSequence() { return optimizedSequence; }
    public void setOptimizedSequence(List<Map<String, Object>> optimizedSequence) { this.optimizedSequence = optimizedSequence; }

    public int getTimeSavedMinutes() { return timeSavedMinutes; }
    public void setTimeSavedMinutes(int timeSavedMinutes) { this.timeSavedMinutes = timeSavedMinutes; }

    public double getCarbonOffsetKg() { return carbonOffsetKg; }
    public void setCarbonOffsetKg(double carbonOffsetKg) { this.carbonOffsetKg = carbonOffsetKg; }

    public int getEcoPointsAwarded() { return ecoPointsAwarded; }
    public void setEcoPointsAwarded(int ecoPointsAwarded) { this.ecoPointsAwarded = ecoPointsAwarded; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
