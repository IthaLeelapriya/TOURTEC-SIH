package com.tourtec.model;

import java.util.List;
import java.util.Map;

public class AssistantQueryResponse {
    private String reply;
    private String category;
    private String currentLocation;
    private String targetLanguage;
    private Map<String, String> localGreeting;
    private boolean audioTourAvailable;
    private List<String> suggestedQuestions;

    public AssistantQueryResponse() {}

    public AssistantQueryResponse(String reply, String category, String currentLocation, String targetLanguage, Map<String, String> localGreeting, boolean audioTourAvailable, List<String> suggestedQuestions) {
        this.reply = reply;
        this.category = category;
        this.currentLocation = currentLocation;
        this.targetLanguage = targetLanguage;
        this.localGreeting = localGreeting;
        this.audioTourAvailable = audioTourAvailable;
        this.suggestedQuestions = suggestedQuestions;
    }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(String currentLocation) { this.currentLocation = currentLocation; }

    public String getTargetLanguage() { return targetLanguage; }
    public void setTargetLanguage(String targetLanguage) { this.targetLanguage = targetLanguage; }

    public Map<String, String> getLocalGreeting() { return localGreeting; }
    public void setLocalGreeting(Map<String, String> localGreeting) { this.localGreeting = localGreeting; }

    public boolean isAudioTourAvailable() { return audioTourAvailable; }
    public void setAudioTourAvailable(boolean audioTourAvailable) { this.audioTourAvailable = audioTourAvailable; }

    public List<String> getSuggestedQuestions() { return suggestedQuestions; }
    public void setSuggestedQuestions(List<String> suggestedQuestions) { this.suggestedQuestions = suggestedQuestions; }
}
