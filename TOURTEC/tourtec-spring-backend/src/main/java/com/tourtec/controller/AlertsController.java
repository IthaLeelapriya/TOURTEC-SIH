package com.tourtec.controller;

import com.tourtec.model.Alert;
import com.tourtec.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
public class AlertsController {

    @Autowired
    private AlertService alertService;

    @GetMapping
    public List<Alert> getAlerts(@RequestParam(required = false) String destinationId) {
        return alertService.getAlerts(destinationId);
    }

    @PostMapping
    public ResponseEntity<Alert> createAlert(@RequestBody Alert newAlert) {
        Alert created = alertService.createAlert(newAlert);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/acknowledge")
    public Map<String, Object> acknowledgeAlert(@RequestBody Map<String, String> payload) {
        String alertId = payload.get("alertId");
        boolean success = alertService.acknowledgeAlert(alertId);
        return Collections.singletonMap("success", success);
    }
}
