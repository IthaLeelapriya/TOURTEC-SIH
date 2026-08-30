package com.tourtec.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "alerts")
public class AlertEntity {

    @Id
    private String id;

    @Column(name = "destination_id", nullable = false)
    private String destinationId;

    private String type;
    private String severity;
    private String title;

    @Column(length = 1000)
    private String message;

    private String timestamp;
    private boolean active;
    private double lat;
    private double lng;
    private int radiusMeters;
    private boolean acknowledged;

    public AlertEntity() {}

    public AlertEntity(String id, String destinationId, String type, String severity, String title, String message, String timestamp, boolean active, double lat, double lng, int radiusMeters) {
        this.id = id;
        this.destinationId = destinationId;
        this.type = type;
        this.severity = severity;
        this.title = title;
        this.message = message;
        this.timestamp = timestamp;
        this.active = active;
        this.lat = lat;
        this.lng = lng;
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

    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }

    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }

    public int getRadiusMeters() { return radiusMeters; }
    public void setRadiusMeters(int radiusMeters) { this.radiusMeters = radiusMeters; }

    public boolean isAcknowledged() { return acknowledged; }
    public void setAcknowledged(boolean acknowledged) { this.acknowledged = acknowledged; }
}
