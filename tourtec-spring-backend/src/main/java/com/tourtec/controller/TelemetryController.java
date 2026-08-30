package com.tourtec.controller;

import com.tourtec.model.Destination;
import com.tourtec.model.DigitalTwin;
import com.tourtec.model.Zone;
import com.tourtec.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/telemetry")
public class TelemetryController {

    @Autowired
    private DestinationService destinationService;

    private final Random random = new Random();

    @GetMapping("/live")
    public Map<String, Object> getLiveTelemetry(@RequestParam(defaultValue = "varanasi") String destinationId) {
        Destination dest = destinationService.getDestinationById(destinationId)
                .orElse(destinationService.getAllDestinations().get(0));

        Map<String, Object> response = new HashMap<>();
        response.put("destinationId", dest.getId());
        response.put("timestamp", Instant.now().toString());
        response.put("weather", dest.getWeather());

        List<Zone> randomizedZones = new ArrayList<>();
        for (Zone z : dest.getZones()) {
            Zone rz = new Zone(
                z.getId(),
                z.getName(),
                z.getLat(),
                z.getLng(),
                z.getCapacity(),
                Math.max(10, z.getCurrentVisitors() + (random.nextInt(31) - 15)),
                z.getDensity(),
                z.getWaitTime(),
                z.getStatus(),
                z.getEcoRewardTokens()
            );
            randomizedZones.add(rz);
        }
        response.put("zones", randomizedZones);

        DigitalTwin dt = dest.getDigitalTwin();
        DigitalTwin liveTwin = new DigitalTwin(
            dt.getActiveTourists() + (random.nextInt(81) - 40),
            dt.getCarbonOffsetScore(),
            dt.getNoiseDecibels(),
            dt.getAvgTransitPace(),
            dt.getQueueEfficiency(),
            (210 + random.nextInt(40)) + " pings/min",
            (10 + random.nextInt(6)) + "ms"
        );
        response.put("digitalTwin", liveTwin);

        return response;
    }
}
