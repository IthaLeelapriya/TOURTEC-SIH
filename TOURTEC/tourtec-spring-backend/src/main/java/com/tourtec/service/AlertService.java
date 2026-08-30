package com.tourtec.service;

import com.tourtec.entity.AlertEntity;
import com.tourtec.model.Alert;
import com.tourtec.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    public List<Alert> getAlerts(String destinationId) {
        List<AlertEntity> entities;
        if (destinationId != null && !destinationId.isEmpty()) {
            entities = alertRepository.findByDestinationId(destinationId);
        } else {
            entities = alertRepository.findAll();
        }

        return entities.stream().map(this::toModel).collect(Collectors.toList());
    }

    public Alert createAlert(Alert newAlert) {
        String id = newAlert.getId() != null ? newAlert.getId() : "alt-ind-" + System.currentTimeMillis();
        double lat = newAlert.getCoordinates() != null && newAlert.getCoordinates().containsKey("lat") ? newAlert.getCoordinates().get("lat") : 25.3176;
        double lng = newAlert.getCoordinates() != null && newAlert.getCoordinates().containsKey("lng") ? newAlert.getCoordinates().get("lng") : 83.0062;

        AlertEntity entity = new AlertEntity(
            id,
            newAlert.getDestinationId() != null ? newAlert.getDestinationId() : "varanasi",
            newAlert.getType() != null ? newAlert.getType() : "geofence",
            newAlert.getSeverity() != null ? newAlert.getSeverity() : "warning",
            newAlert.getTitle() != null ? newAlert.getTitle() : "Tourism Advisory",
            newAlert.getMessage() != null ? newAlert.getMessage() : "Notice for all visitors in the heritage corridor.",
            "Just now",
            true,
            lat,
            lng,
            newAlert.getRadiusMeters() > 0 ? newAlert.getRadiusMeters() : 500
        );

        AlertEntity saved = alertRepository.save(entity);
        return toModel(saved);
    }

    public boolean acknowledgeAlert(String alertId) {
        Optional<AlertEntity> optional = alertRepository.findById(alertId);
        if (optional.isPresent()) {
            AlertEntity entity = optional.get();
            entity.setAcknowledged(true);
            alertRepository.save(entity);
            return true;
        }
        return false;
    }

    private Alert toModel(AlertEntity e) {
        Map<String, Double> coords = new HashMap<>();
        coords.put("lat", e.getLat());
        coords.put("lng", e.getLng());

        Alert a = new Alert(
            e.getId(),
            e.getDestinationId(),
            e.getType(),
            e.getSeverity(),
            e.getTitle(),
            e.getMessage(),
            e.getTimestamp(),
            e.isActive(),
            coords,
            e.getRadiusMeters()
        );
        a.setAcknowledged(e.isAcknowledged());
        return a;
    }
}
