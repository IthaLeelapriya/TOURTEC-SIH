package com.tourtec.model;

import java.util.Map;

public class Alert {
    private String id;
    private String destinationId;
    private String type;
    private String severity;
    private String title;
    private String message;
    private String timestamp;
    private boolean active;
    private Map<String, Double> coordinates;
    private int radiusMeters;
    private boolean acknowledged;

    public Alert() {}

    public Alert(String id, String destinationId, String type, String severity, String title, String message, String timestamp, boolean active, Map<String, Double> coordinates, int radiusMeters) {
        this.id = id;
        this.destinationId = destinationId;
        this.type = type;
        this.severity = severity;
        this.title = title;
        this.message = message;
        this.timestamp = timestamp;
        this.active = active;
        this.coordinates = coordinates;
        this.radiusMeters = radiusMeters;
        this.acknowledged = false;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDestinationId() { return destinationId; }
    public void setDestinationId(String destinationId) { this.destinationId = destinationId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Map<String, Double> getCoordinates() { return coordinates; }
    public void setCoordinates(Map<String, Double> coordinates) { this.coordinates = coordinates; }

    public int getRadiusMeters() { return radiusMeters; }
    public void setRadiusMeters(int radiusMeters) { this.radiusMeters = radiusMeters; }

    public boolean isAcknowledged() { return acknowledged; }
    public void setAcknowledged(boolean acknowledged) { this.acknowledged = acknowledged; }
}
