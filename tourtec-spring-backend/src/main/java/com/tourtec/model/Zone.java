package com.tourtec.model;

public class Zone {
    private String id;
    private String name;
    private double lat;
    private double lng;
    private int capacity;
    private int currentVisitors;
    private String density;
    private String waitTime;
    private String status; // 'overcrowded', 'heavy', 'optimal', 'recommended'
    private int ecoRewardTokens;

    public Zone() {}

    public Zone(String id, String name, double lat, double lng, int capacity, int currentVisitors, String density, String waitTime, String status, int ecoRewardTokens) {
        this.id = id;
        this.name = name;
        this.lat = lat;
        this.lng = lng;
        this.capacity = capacity;
        this.currentVisitors = currentVisitors;
        this.density = density;
        this.waitTime = waitTime;
        this.status = status;
        this.ecoRewardTokens = ecoRewardTokens;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }

    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public int getCurrentVisitors() { return currentVisitors; }
    public void setCurrentVisitors(int currentVisitors) { this.currentVisitors = currentVisitors; }

    public String getDensity() { return density; }
    public void setDensity(String density) { this.density = density; }

    public String getWaitTime() { return waitTime; }
    public void setWaitTime(String waitTime) { this.waitTime = waitTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getEcoRewardTokens() { return ecoRewardTokens; }
    public void setEcoRewardTokens(int ecoRewardTokens) { this.ecoRewardTokens = ecoRewardTokens; }
}
