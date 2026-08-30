package com.tourtec.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sos_logs")
public class SosLogEntity {

    @Id
    private String dispatchId;

    private String touristId;
    private String destinationId;
    private String reason;
    private double lat;
    private double lng;
    private String assignedOfficer;
    private String rangerContact;
    private String status;
    private LocalDateTime timestamp;

    public SosLogEntity() {
        this.timestamp = LocalDateTime.now();
    }

    public SosLogEntity(String dispatchId, String touristId, String destinationId, String reason, double lat, double lng, String assignedOfficer, String rangerContact, String status) {
        this.dispatchId = dispatchId;
        this.touristId = touristId;
        this.destinationId = destinationId;
        this.reason = reason;
        this.lat = lat;
        this.lng = lng;
        this.assignedOfficer = assignedOfficer;
        this.rangerContact = rangerContact;
        this.status = status;
        this.timestamp = LocalDateTime.now();
    }

    public String getDispatchId() { return dispatchId; }
    public void setDispatchId(String dispatchId) { this.dispatchId = dispatchId; }

    public String getTouristId() { return touristId; }
    public void setTouristId(String touristId) { this.touristId = touristId; }

    public String getDestinationId() { return destinationId; }
    public void setDestinationId(String destinationId) { this.destinationId = destinationId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }

    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }

    public String getAssignedOfficer() { return assignedOfficer; }
    public void setAssignedOfficer(String assignedOfficer) { this.assignedOfficer = assignedOfficer; }

    public String getRangerContact() { return rangerContact; }
    public void setRangerContact(String rangerContact) { this.rangerContact = rangerContact; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
