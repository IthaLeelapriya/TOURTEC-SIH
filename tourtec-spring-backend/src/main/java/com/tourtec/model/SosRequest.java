package com.tourtec.model;

import java.util.Map;

public class SosRequest {
    private String touristId;
    private Map<String, Double> coordinates;
    private String destinationId;
    private String reason;

    public SosRequest() {}

    public String getTouristId() { return touristId; }
    public void setTouristId(String touristId) { this.touristId = touristId; }

    public Map<String, Double> getCoordinates() { return coordinates; }
    public void setCoordinates(Map<String, Double> coordinates) { this.coordinates = coordinates; }

    public String getDestinationId() { return destinationId; }
    public void setDestinationId(String destinationId) { this.destinationId = destinationId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
