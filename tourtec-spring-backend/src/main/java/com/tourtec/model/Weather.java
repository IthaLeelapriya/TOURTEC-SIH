package com.tourtec.model;

public class Weather {
    private String temp;
    private String condition;
    private String humidity;
    private String aqi;
    private String uvIndex;

    public Weather() {}

    public Weather(String temp, String condition, String humidity, String aqi, String uvIndex) {
        this.temp = temp;
        this.condition = condition;
        this.humidity = humidity;
        this.aqi = aqi;
        this.uvIndex = uvIndex;
    }

    public String getTemp() { return temp; }
    public void setTemp(String temp) { this.temp = temp; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public String getHumidity() { return humidity; }
    public void setHumidity(String humidity) { this.humidity = humidity; }

    public String getAqi() { return aqi; }
    public void setAqi(String aqi) { this.aqi = aqi; }

    public String getUvIndex() { return uvIndex; }
    public void setUvIndex(String uvIndex) { this.uvIndex = uvIndex; }
}
