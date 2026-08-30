package com.tourtec.controller;

import com.tourtec.model.Destination;
import com.tourtec.model.Zone;
import com.tourtec.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/flow")
public class FlowDistributionController {

    @Autowired
    private DestinationService destinationService;

    private final Random random = new Random();

    @PostMapping("/redistribute")
    public Map<String, Object> redistributeFlow(@RequestBody(required = false) Map<String, Object> payload) {
        String destId = payload != null && payload.containsKey("destinationId") ? (String) payload.get("destinationId") : "varanasi";
        Destination dest = destinationService.getDestinationById(destId)
                .orElse(destinationService.getAllDestinations().get(0));

        Zone overcrowded = dest.getZones().stream()
                .filter(z -> "overcrowded".equalsIgnoreCase(z.getStatus()))
                .findFirst()
                .orElse(dest.getZones().get(0));

        Zone recommended = dest.getZones().stream()
                .filter(z -> "recommended".equalsIgnoreCase(z.getStatus()))
                .findFirst()
                .orElse(dest.getZones().get(dest.getZones().size() - 1));

        Map<String, Object> response = new HashMap<>();
        response.put("destinationId", dest.getId());
        response.put("timestamp", Instant.now().toString());
        response.put("totalDivertedProjected", 1680);
        response.put("congestionReductionPercentage", "36.4%");

        Map<String, Object> rec = new HashMap<>();
        rec.put("fromZone", overcrowded.getName());
        rec.put("toZone", recommended.getName());
        rec.put("timeSavedMinutes", 45);
        rec.put("ecoPointsAwarded", recommended.getEcoRewardTokens() > 0 ? recommended.getEcoRewardTokens() : 50);
        rec.put("fastPassPerk", "VIP FastPass & Free Heritage Chai/Prasad at " + recommended.getName());
        rec.put("crowdDifference", "-76% Congestion");
        rec.put("walkingDistance", "700m (9 mins heritage walk / e-rickshaw)");
        rec.put("incentiveCode", "TOURTEC-INDIA-" + (1000 + random.nextInt(9000)));

        response.put("recommendations", Collections.singletonList(rec));
        return response;
    }

    @PostMapping("/claim-voucher")
    public Map<String, Object> claimVoucher(@RequestBody(required = false) Map<String, String> payload) {
        String voucherCode = payload != null && payload.containsKey("voucherCode") ? payload.get("voucherCode") : "FASTPASS-IND-88";
        String touristId = payload != null && payload.containsKey("touristId") ? payload.get("touristId") : "TOURIST-IND-01";

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("voucherCode", voucherCode);
        response.put("touristId", touristId);
        response.put("claimedAt", Instant.now().toString());
        response.put("status", "ACTIVE");
        response.put("perk", "VIP Express Darshan Line Access + Free Kulhad Chai");
        response.put("ecoPointsAwarded", 50);
        return response;
    }
}
