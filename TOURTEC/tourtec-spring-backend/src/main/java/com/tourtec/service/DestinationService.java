package com.tourtec.service;

import com.tourtec.entity.DestinationEntity;
import com.tourtec.entity.ZoneEntity;
import com.tourtec.model.Destination;
import com.tourtec.model.DigitalTwin;
import com.tourtec.model.Weather;
import com.tourtec.model.Zone;
import com.tourtec.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    @Autowired
    private DestinationRepository destinationRepository;

    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll().stream()
                .map(this::toModel)
                .collect(Collectors.toList());
    }

    public Optional<Destination> getDestinationById(String id) {
        return destinationRepository.findById(id).map(this::toModel);
    }

    public Destination toModel(DestinationEntity entity) {
        Map<String, Double> center = new HashMap<>();
        center.put("lat", entity.getCenterLat());
        center.put("lng", entity.getCenterLng());

        Weather weather = new Weather(
            entity.getWeatherTemp(),
            entity.getWeatherCondition(),
            entity.getWeatherHumidity(),
            entity.getWeatherAqi(),
            entity.getWeatherUvIndex()
        );

        DigitalTwin digitalTwin = new DigitalTwin(
            entity.getActiveTourists(),
            entity.getCarbonOffsetScore(),
            entity.getNoiseDecibels(),
            entity.getAvgTransitPace(),
            entity.getQueueEfficiency(),
            entity.getLiveSensorPings(),
            entity.getNetworkLatency()
        );

        List<Zone> zones = entity.getZones().stream().map(z -> new Zone(
            z.getId(),
            z.getName(),
            z.getLat(),
            z.getLng(),
            z.getCapacity(),
            z.getCurrentVisitors(),
            z.getDensity(),
            z.getWaitTime(),
            z.getStatus(),
            z.getEcoRewardTokens()
        )).collect(Collectors.toList());

        return new Destination(
            entity.getId(),
            entity.getName(),
            entity.getCountry(),
            entity.getFlag(),
            center,
            entity.getZoom(),
            entity.getTagline(),
            weather,
            zones,
            digitalTwin
        );
    }
}
