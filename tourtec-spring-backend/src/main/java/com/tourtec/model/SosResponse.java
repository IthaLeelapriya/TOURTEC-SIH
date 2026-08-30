package com.tourtec.model;

import java.util.Map;

public class SosResponse {
    private boolean success;
    private String dispatchId;
    private String status;
    private String message;
    private String etaRanger;
    private boolean beaconActive;
    private Map<String, Double> coordinates;
    private String assignedOfficer;
    private String rangerContact;
    private String instruction;

    public SosResponse() {}

    public SosResponse(boolean success, String dispatchId, String status, String message, String etaRanger, boolean beaconActive, Map<String, Double> coordinates, String assignedOfficer, String rangerContact, String instruction) {
        this.success = success;
        this.dispatchId = dispatchId;
        this.status = status;
        this.message = message;
        this.etaRanger = etaRanger;
        this.beaconActive = beaconActive;
        this.coordinates = coordinates;
        this.assignedOfficer = assignedOfficer;
        this.rangerContact = rangerContact;
        this.instruction = instruction;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getDispatchId() { return dispatchId; }
    public void setDispatchId(String dispatchId) { this.dispatchId = dispatchId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getEtaRanger() { return etaRanger; }
    public void setEtaRanger(String etaRanger) { this.etaRanger = etaRanger; }

    public boolean isBeaconActive() { return beaconActive; }
    public void setBeaconActive(boolean beaconActive) { this.beaconActive = beaconActive; }

    public Map<String, Double> getCoordinates() { return coordinates; }
    public void setCoordinates(Map<String, Double> coordinates) { this.coordinates = coordinates; }

    public String getAssignedOfficer() { return assignedOfficer; }
    public void setAssignedOfficer(String assignedOfficer) { this.assignedOfficer = assignedOfficer; }

    public String getRangerContact() { return rangerContact; }
    public void setRangerContact(String rangerContact) { this.rangerContact = rangerContact; }

    public String getInstruction() { return instruction; }
    public void setInstruction(String instruction) { this.instruction = instruction; }
}
