package com.tourtec.controller;

import com.tourtec.model.RoadmapOptimizationRequest;
import com.tourtec.model.RoadmapOptimizationResponse;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/roadmap")
public class RoadmapController {

    private final Random random = new Random();

    @PostMapping("/optimize")
    public RoadmapOptimizationResponse optimizeRoadmap(@RequestBody RoadmapOptimizationRequest request) {
        String destId = request.getDestinationId() != null ? request.getDestinationId() : "varanasi";
        List<Map<String, Object>> stops = request.getCurrentStops() != null ? request.getCurrentStops() : new ArrayList<>();

        List<Map<String, Object>> optimized = new ArrayList<>();
        int idx = 0;
        for (Map<String, Object> stop : stops) {
            Map<String, Object> optStop = new HashMap<>(stop);
            optStop.put("optimizedTime", String.format("0%d:30 AM", (8 + idx * 2)));
            optStop.put("crowdForecast", idx % 2 == 0 ? "Low (22%)" : "Moderate (45%)");
            optStop.put("ecoBonus", 35);
            optimized.add(optStop);
            idx++;
        }

        return new RoadmapOptimizationResponse(
            true,
            destId,
            optimized,
            42,
            2.8,
            35,
            "✨ Itinerary optimized! Rescheduled peak temple darshan and ghat aarti timings to minimize queues and heat."
        );
    }

    @PostMapping("/pass")
    public Map<String, Object> generateTravelPass(@RequestBody Map<String, String> payload) {
        String touristId = payload.getOrDefault("touristId", "TOURIST-IND-01");
        String destinationId = payload.getOrDefault("destinationId", "varanasi");
        String passId = "PASS-IND-" + (10000 + random.nextInt(90000));

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("passId", passId);
        response.put("touristId", touristId);
        response.put("destinationId", destinationId);
        response.put("qrPayload", "TOURTEC://PASS/" + passId + "?DEST=" + destinationId);
        response.put("validUntil", "23:59:59 Today");
        response.put("fastPassDarshan", true);
        response.put("solarBoatPass", true);
        response.put("waterRefillEntitlement", "Unlimited at all Bharat RO Smart Kiosks");
        return response;
    }
}
