package com.tourtec.model;

public class DigitalTwin {
    private int activeTourists;
    private String carbonOffsetScore;
    private String noiseDecibels;
    private String avgTransitPace;
    private String queueEfficiency;
    private String liveSensorPings;
    private String networkLatency;

    public DigitalTwin() {}

    public DigitalTwin(int activeTourists, String carbonOffsetScore, String noiseDecibels, String avgTransitPace, String queueEfficiency, String liveSensorPings, String networkLatency) {
        this.activeTourists = activeTourists;
        this.carbonOffsetScore = carbonOffsetScore;
        this.noiseDecibels = noiseDecibels;
        this.avgTransitPace = avgTransitPace;
        this.queueEfficiency = queueEfficiency;
        this.liveSensorPings = liveSensorPings;
        this.networkLatency = networkLatency;
    }

    public int getActiveTourists() { return activeTourists; }
    public void setActiveTourists(int activeTourists) { this.activeTourists = activeTourists; }

    public String getCarbonOffsetScore() { return carbonOffsetScore; }
    public void setCarbonOffsetScore(String carbonOffsetScore) { this.carbonOffsetScore = carbonOffsetScore; }

    public String getNoiseDecibels() { return noiseDecibels; }
    public void setNoiseDecibels(String noiseDecibels) { this.noiseDecibels = noiseDecibels; }

    public String getAvgTransitPace() { return avgTransitPace; }
    public void setAvgTransitPace(String avgTransitPace) { this.avgTransitPace = avgTransitPace; }

    public String getQueueEfficiency() { return queueEfficiency; }
    public void setQueueEfficiency(String queueEfficiency) { this.queueEfficiency = queueEfficiency; }

    public String getLiveSensorPings() { return liveSensorPings; }
    public void setLiveSensorPings(String liveSensorPings) { this.liveSensorPings = liveSensorPings; }

    public String getNetworkLatency() { return networkLatency; }
    public void setNetworkLatency(String networkLatency) { this.networkLatency = networkLatency; }
}
