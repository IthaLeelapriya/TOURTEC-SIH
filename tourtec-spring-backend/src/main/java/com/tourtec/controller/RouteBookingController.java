package com.tourtec.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/routes")
public class RouteBookingController {

    @GetMapping("/calculate")
    public Map<String, Object> calculateRoute(
            @RequestParam(defaultValue = "Assi Ghat") String source,
            @RequestParam(defaultValue = "Kashi Vishwanath Corridor") String destination,
            @RequestParam(defaultValue = "varanasi") String destinationId) {

        Map<String, Object> response = new HashMap<>();
        response.put("source", source);
        response.put("destination", destination);
        response.put("distanceKm", 3.2);
        response.put("estimatedTime", "14 mins");

        List<Map<String, Object>> options = new ArrayList<>();

        // Option 1: E-Rickshaw / Auto (Recommended)
        Map<String, Object> erickshaw = new HashMap<>();
        erickshaw.put("id", "opt-erickshaw");
        erickshaw.put("mode", "erickshaw");
        erickshaw.put("title", "Green E-Rickshaw / Shared Auto");
        erickshaw.put("tag", "Recommended • Fastest in City");
        erickshaw.put("tagColor", "bg-amber-100 text-amber-900 border-amber-300");
        erickshaw.put("icon", "🛺");
        erickshaw.put("time", "12 mins");
        erickshaw.put("fare", "₹30 - ₹50");
        erickshaw.put("carbonSaved", "100% Zero Emission");
        erickshaw.put("description", "Direct transit via heritage lanes. Frequent stands at main crossings.");
        erickshaw.put("bookingPlatform", "Rapido Auto / Local Stand");
        erickshaw.put("bookingUrl", "https://rapido.bike/");
        options.add(erickshaw);

        // Option 2: Solar Electric River Boat (Scenic)
        Map<String, Object> boat = new HashMap<>();
        boat.put("id", "opt-boat");
        boat.put("mode", "boat");
        boat.put("title", "Ganga Solar Electric Ferry");
        boat.put("tag", "Scenic • Zero Traffic");
        boat.put("tagColor", "bg-emerald-100 text-emerald-900 border-emerald-300");
        boat.put("icon", "🛥️");
        boat.put("time", "15 mins");
        boat.put("fare", "₹50 - ₹80");
        boat.put("carbonSaved", "100% Solar Powered");
        boat.put("description", "Cruise smoothly past historic ghats without any road congestion.");
        boat.put("bookingPlatform", "UP Tourism Smart Boat Portal");
        boat.put("bookingUrl", "https://uptourism.gov.in/");
        options.add(boat);

        // Option 3: AC Tourist Cab / Uber / Ola
        Map<String, Object> cab = new HashMap<>();
        cab.put("id", "opt-cab");
        cab.put("mode", "cab");
        cab.put("title", "AC Cab / Tourist Taxi (Uber / Ola)");
        cab.put("tag", "AC Comfort • Door-to-Door");
        cab.put("tagColor", "bg-blue-100 text-blue-900 border-blue-300");
        cab.put("icon", "🚕");
        cab.put("time", "10 mins");
        cab.put("fare", "₹120 - ₹180");
        cab.put("carbonSaved", "Standard");
        cab.put("description", "Air-conditioned cab pickup directly from your hotel or current GPS spot.");
        cab.put("bookingPlatform", "Uber / Ola");
        cab.put("bookingUrl", "https://m.uber.com/ul/?action=setPickup&dropoff=" + destination.replace(" ", "+"));
        options.add(cab);

        // Option 4: Green Electric City Bus
        Map<String, Object> bus = new HashMap<>();
        bus.put("id", "opt-bus");
        bus.put("mode", "bus");
        bus.put("title", "Green Electric City Bus (#E-07)");
        bus.put("tag", "Cheapest • ₹15 Only");
        bus.put("tagColor", "bg-purple-100 text-purple-900 border-purple-300");
        bus.put("icon", "🚌");
        bus.put("time", "20 mins");
        bus.put("fare", "₹15");
        bus.put("carbonSaved", "Eco-Transit");
        bus.put("description", "Air-conditioned government electric bus with digital QR ticketing.");
        bus.put("bookingPlatform", "Chalo App / RedBus");
        bus.put("bookingUrl", "https://www.redbus.in/");
        options.add(bus);

        response.put("options", options);
        return response;
    }
}
