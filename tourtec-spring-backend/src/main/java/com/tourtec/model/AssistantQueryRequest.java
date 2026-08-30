package com.tourtec.model;

public class AssistantQueryRequest {
    private String query;
    private String language;
    private String locationContext;
    private String destinationId;

    public AssistantQueryRequest() {}

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getLocationContext() { return locationContext; }
    public void setLocationContext(String locationContext) { this.locationContext = locationContext; }

    public String getDestinationId() { return destinationId; }
    public void setDestinationId(String destinationId) { this.destinationId = destinationId; }
}
