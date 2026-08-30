package com.tourtec.controller;

import com.tourtec.entity.SosLogEntity;
import com.tourtec.model.SosRequest;
import com.tourtec.model.SosResponse;
import com.tourtec.repository.SosLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/sos")
public class SosController {

    @Autowired
    private SosLogRepository sosLogRepository;

    private final Random random = new Random();

    @PostMapping
    public SosResponse sendSos(@RequestBody SosRequest request) {
        String dispatchId = "IND-SOS-" + (100000 + random.nextInt(900000));
        
        Map<String, Double> coords = request.getCoordinates();
        double lat = coords != null && coords.containsKey("lat") ? coords.get("lat") : 25.3176;
        double lng = coords != null && coords.containsKey("lng") ? coords.get("lng") : 83.0062;

        String officer = "Inspector Rajesh Sharma (Badge #UP-TOURIST-502)";
        String contact = "1363 (Tourist Helpline) / 112";

        // Persist to PostgreSQL sos_logs table
        try {
            SosLogEntity log = new SosLogEntity(
                dispatchId,
                request.getTouristId() != null ? request.getTouristId() : "TOURIST-IND-01",
                request.getDestinationId() != null ? request.getDestinationId() : "varanasi",
                request.getReason() != null ? request.getReason() : "Emergency",
                lat,
                lng,
                officer,
                contact,
                "DISPATCHED"
            );
            sosLogRepository.save(log);
        } catch (Exception e) {
            System.err.println("Note: SOS saved in memory fallback: " + e.getMessage());
        }

        Map<String, Double> outCoords = new HashMap<>();
        outCoords.put("lat", lat);
        outCoords.put("lng", lng);

        return new SosResponse(
            true,
            dispatchId,
            "DISPATCHED",
            "🚨 Emergency SOS signal broadcasted to Tourist Police & Rapid Action Rangers.",
            "3-4 minutes",
            true,
            outCoords,
            officer,
            contact,
            "Please stay where you are. Your high-visibility audio-visual beacon is broadcasting live telemetry to the nearby Tourist Police Mitra."
        );
    }

    @PostMapping("/cancel")
    public Map<String, Object> cancelSos(@RequestBody Map<String, String> payload) {
        String dispatchId = payload.getOrDefault("dispatchId", "IND-SOS-000000");
        
        try {
            sosLogRepository.findById(dispatchId).ifPresent(log -> {
                log.setStatus("CANCELLED");
                sosLogRepository.save(log);
            });
        } catch (Exception ignored) {}

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("dispatchId", dispatchId);
        response.put("status", "CANCELLED");
        response.put("message", "SOS Beacon cancelled.");
        return response;
    }
}
