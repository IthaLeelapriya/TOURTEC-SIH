package com.tourtec.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "destinations")
public class DestinationEntity {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String country;
    private String flag;
    private double centerLat;
    private double centerLng;
    private int zoom;
    private String tagline;

    // Weather fields
    private String weatherTemp;
    private String weatherCondition;
    private String weatherHumidity;
    private String weatherAqi;
    private String weatherUvIndex;

    // Digital Twin fields
    private int activeTourists;
    private String carbonOffsetScore;
    private String noiseDecibels;
    private String avgTransitPace;
    private String queueEfficiency;
    private String liveSensorPings;
    private String networkLatency;

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ZoneEntity> zones = new ArrayList<>();

    public DestinationEntity() {}

    public DestinationEntity(String id, String name, String country, String flag, double centerLat, double centerLng, int zoom, String tagline, String weatherTemp, String weatherCondition, String weatherHumidity, String weatherAqi, String weatherUvIndex, int activeTourists, String carbonOffsetScore, String noiseDecibels, String avgTransitPace, String queueEfficiency, String liveSensorPings, String networkLatency) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.flag = flag;
        this.centerLat = centerLat;
        this.centerLng = centerLng;
        this.zoom = zoom;
        this.tagline = tagline;
        this.weatherTemp = weatherTemp;
        this.weatherCondition = weatherCondition;
        this.weatherHumidity = weatherHumidity;
        this.weatherAqi = weatherAqi;
        this.weatherUvIndex = weatherUvIndex;
        this.activeTourists = activeTourists;
        this.carbonOffsetScore = carbonOffsetScore;
        this.noiseDecibels = noiseDecibels;
        this.avgTransitPace = avgTransitPace;
        this.queueEfficiency = queueEfficiency;
        this.liveSensorPings = liveSensorPings;
        this.networkLatency = networkLatency;
    }

    public void addZone(ZoneEntity zone) {
        zones.add(zone);
        zone.setDestination(this);
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getFlag() { return flag; }
    public void setFlag(String flag) { this.flag = flag; }

    public double getCenterLat() { return centerLat; }
    public void setCenterLat(double centerLat) { this.centerLat = centerLat; }

    public double getCenterLng() { return centerLng; }
    public void setCenterLng(double centerLng) { this.centerLng = centerLng; }

    public int getZoom() { return zoom; }
    public void setZoom(int zoom) { this.zoom = zoom; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getWeatherTemp() { return weatherTemp; }
    public void setWeatherTemp(String weatherTemp) { this.weatherTemp = weatherTemp; }

    public String getWeatherCondition() { return weatherCondition; }
    public void setWeatherCondition(String weatherCondition) { this.weatherCondition = weatherCondition; }

    public String getWeatherHumidity() { return weatherHumidity; }
    public void setWeatherHumidity(String weatherHumidity) { this.weatherHumidity = weatherHumidity; }

    public String getWeatherAqi() { return weatherAqi; }
    public void setWeatherAqi(String weatherAqi) { this.weatherAqi = weatherAqi; }

    public String getWeatherUvIndex() { return weatherUvIndex; }
    public void setWeatherUvIndex(String weatherUvIndex) { this.weatherUvIndex = weatherUvIndex; }

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

    public List<ZoneEntity> getZones() { return zones; }
    public void setZones(List<ZoneEntity> zones) { this.zones = zones; }
}
