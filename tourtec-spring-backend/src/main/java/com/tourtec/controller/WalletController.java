package com.tourtec.controller;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final Random random = new Random();

    @GetMapping("/balance")
    public Map<String, Object> getWalletBalance() {
        Map<String, Object> response = new HashMap<>();
        response.put("balancePoints", 240);
        response.put("currency", "INR Eco-Tokens (₹)");

        List<Map<String, Object>> catalog = new ArrayList<>();

        Map<String, Object> item1 = new HashMap<>();
        item1.put("id", "rw1");
        item1.put("name", "Organic Kulhad Chai & Saffron Jalebi");
        item1.put("pointsCost", 120);
        item1.put("vendor", "Godowlia Heritage Stall");
        catalog.add(item1);

        Map<String, Object> item2 = new HashMap<>();
        item2.put("id", "rw2");
        item2.put("name", "1-Day Heritage Solar Boat Pass");
        item2.put("pointsCost", 250);
        item2.put("vendor", "Ganga Inland Waterways");
        catalog.add(item2);

        Map<String, Object> item3 = new HashMap<>();
        item3.put("id", "rw3");
        item3.put("name", "Kashi Temple FastPass Darshan Entry");
        item3.put("pointsCost", 180);
        item3.put("vendor", "Trust Board Counter");
        catalog.add(item3);

        response.put("catalog", catalog);
        return response;
    }

    @PostMapping("/redeem")
    public Map<String, Object> redeemReward(@RequestBody Map<String, Object> payload) {
        String rewardId = (String) payload.getOrDefault("rewardId", "rw1");
        int points = payload.containsKey("points") ? (int) payload.get("points") : 120;

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("rewardId", rewardId);
        response.put("voucherToken", "REDEEM-IND-" + (1000 + random.nextInt(9000)));
        response.put("remainingPoints", Math.max(0, 240 - points));
        response.put("redemptionInstructions", "Show this voucher QR at the participating heritage vendor.");
        return response;
    }
}
