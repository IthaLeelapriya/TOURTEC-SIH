package com.tourtec.model;

import java.util.List;
import java.util.Map;

public class Destination {
    private String id;
    private String name;
    private String country;
    private String flag;
    private Map<String, Double> center;
    private int zoom;
    private String tagline;
    private Weather weather;
    private List<Zone> zones;
    private DigitalTwin digitalTwin;

    public Destination() {}

    public Destination(String id, String name, String country, String flag, Map<String, Double> center, int zoom, String tagline, Weather weather, List<Zone> zones, DigitalTwin digitalTwin) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.flag = flag;
        this.center = center;
        this.zoom = zoom;
        this.tagline = tagline;
        this.weather = weather;
        this.zones = zones;
        this.digitalTwin = digitalTwin;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getFlag() { return flag; }
    public void setFlag(String flag) { this.flag = flag; }

    public Map<String, Double> getCenter() { return center; }
    public void setCenter(Map<String, Double> center) { this.center = center; }

    public int getZoom() { return zoom; }
    public void setZoom(int zoom) { this.zoom = zoom; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public Weather getWeather() { return weather; }
    public void setWeather(Weather weather) { this.weather = weather; }

    public List<Zone> getZones() { return zones; }
    public void setZones(List<Zone> zones) { this.zones = zones; }

    public DigitalTwin getDigitalTwin() { return digitalTwin; }
    public void setDigitalTwin(DigitalTwin digitalTwin) { this.digitalTwin = digitalTwin; }
}
