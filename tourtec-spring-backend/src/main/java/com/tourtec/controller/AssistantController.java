package com.tourtec.controller;

import com.tourtec.model.AssistantQueryRequest;
import com.tourtec.model.AssistantQueryResponse;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/assistant")
public class AssistantController {

    @PostMapping("/query")
    public AssistantQueryResponse queryAssistant(@RequestBody AssistantQueryRequest request) {
        String query = request.getQuery() != null ? request.getQuery().trim() : "";
        String language = request.getLanguage() != null ? request.getLanguage() : "hi";
        String locationContext = request.getLocationContext() != null ? request.getLocationContext() : "Heritage Corridor";
        String destinationId = request.getDestinationId() != null ? request.getDestinationId().toLowerCase() : "varanasi";

        String lower = query.toLowerCase();
        String replyText;
        String category;

        // Smart Location Resolver based on destinationId or locationContext
        String city = "India";
        if (destinationId.contains("hyderabad") || locationContext.toLowerCase().contains("charminar") || lower.contains("hyderabad")) {
            city = "Hyderabad";
        } else if (destinationId.contains("vijayawada") || locationContext.toLowerCase().contains("kanaka") || lower.contains("vijayawada")) {
            city = "Vijayawada";
        } else if (destinationId.contains("tirupati") || locationContext.toLowerCase().contains("tirumala") || lower.contains("tirupati")) {
            city = "Tirupati";
        } else if (destinationId.contains("jaipur") || locationContext.toLowerCase().contains("amber") || lower.contains("jaipur")) {
            city = "Jaipur";
        } else if (destinationId.contains("agra") || locationContext.toLowerCase().contains("taj") || lower.contains("agra")) {
            city = "Agra";
        } else if (destinationId.contains("goa") || locationContext.toLowerCase().contains("baga") || lower.contains("goa")) {
            city = "Goa";
        } else if (destinationId.contains("delhi") || lower.contains("delhi")) {
            city = "Delhi";
        } else if (destinationId.contains("varanasi") || locationContext.toLowerCase().contains("kashi") || locationContext.toLowerCase().contains("ghat") || lower.contains("varanasi")) {
            city = "Varanasi";
        }

        // 1. History & Significance
        if (lower.contains("history") || lower.contains("founded") || lower.contains("built") || lower.contains("who made") || lower.contains("story") || lower.contains("mythology")) {
            category = "Historical Heritage";
            switch (city) {
                case "Hyderabad":
                    replyText = "🏛️ Hyderabad's History: Founded in 1591 by Muhammad Quli Qutb Shah along the Musi River. The iconic Charminar was built as a centerpiece to commemorate the eradication of a deadly plague. The nearby Golconda Fort was the epicenter of the historic diamond trade, producing the Koh-i-Noor and Hope diamonds!";
                    break;
                case "Vijayawada":
                    replyText = "🕉️ Vijayawada's Sacred History: Located on the banks of the sacred Krishna River, flanked by Indrakeeladri Hill. Legend says Goddess Durga slew the demon Mahishasura here. Arjuna also performed penance to Lord Shiva here and received the celestial Pasupatastra weapon.";
                    break;
                case "Tirupati":
                    replyText = "🕉️ Tirumala Tirupati Heritage: The holy abode of Lord Sri Venkateswara (Kaliyuga Prathyaksha Daivam) nestled on the Seven Seshachalam Hills. Established over 2,000 years ago with patronage from Pallavas, Cholas, and Vijayanagara Emperor Sri Krishna Devaraya.";
                    break;
                case "Jaipur":
                    replyText = "🏰 Jaipur's Royal History: Founded in 1727 by Maharaja Sawai Jai Singh II as India's first planned city based on Vastu Shastra. In 1876, the city was painted terracotta pink to welcome the Prince of Wales, giving it the title 'The Pink City'.";
                    break;
                case "Agra":
                    replyText = "🏛️ Agra's Mughal Heritage: Former capital of the Mughal Empire. Emperor Shah Jahan commissioned the magnificent white-marble Taj Mahal in 1632 as a mausoleum for his beloved wife Mumtaz Mahal, taking 22 years and 20,000 artisans to complete.";
                    break;
                case "Goa":
                    replyText = "🏖️ Goa's Cultural History: A harmonious blend of ancient Konkani heritage and 450 years of Portuguese architectural legacy. Famous for UNESCO World Heritage churches like the Basilica of Bom Jesus, holding the mortal remains of St. Francis Xavier.";
                    break;
                default:
                    replyText = "🕉️ Varanasi's Timeless History: Known as Kashi ('City of Light'), it is one of the world’s oldest living cities (over 3,000 years old). Believed to stand on the trident of Lord Shiva, where the sacred Ganges flows north (Uttara-Vahini).";
                    break;
            }
        }
        // 2. Dress Code & Sacred Etiquette
        else if (lower.contains("dress") || lower.contains("etiquette") || lower.contains("wear") || lower.contains("shoe") || lower.contains("rules") || lower.contains("clothes") || lower.contains("camera") || lower.contains("mobile")) {
            category = "Sacred Etiquette & Dress Code";
            switch (city) {
                case "Hyderabad":
                    replyText = "🥻 Dress Code & Etiquette for Hyderabad: At historic mosques (Mecca Masjid), dress modestly covering shoulders and legs; headscarf recommended for women. At temples (Birla Mandir), footwear must be deposited at free shoe counters outside. Mobile phones & cameras are permitted at Charminar & Forts but restricted inside temple sanctums.";
                    break;
                case "Vijayawada":
                case "Tirupati":
                    replyText = "🥻 Traditional Temple Dress Code: Strict traditional dress code enforced at the sanctum. Men: Dhoti/Kurta or Pajama. Women: Saree, Half-Saree, or Churidar with Dupatta. Western jeans, shorts, and sleeveless tops are not permitted. Footwear and leather belts/bags must be left at free cloakrooms.";
                    break;
                default:
                    replyText = "🥻 Temple & Ghat Etiquette in " + city + ": Always remove shoes at the designated Joota Ghar. Dress modestly covering shoulders and knees. Inside the temple, circumambulate (Pradakshina) in a clockwise direction. Mobile phones must be switched to silent or kept in lockers near entrance.";
                    break;
            }
        }
        // 3. Local Food & Authentic Cuisine
        else if (lower.contains("food") || lower.contains("eat") || lower.contains("restaurant") || lower.contains("dish") || lower.contains("biryani") || lower.contains("lassi") || lower.contains("kachori") || lower.contains("paan") || lower.contains("sweet")) {
            category = "Authentic Local Delicacies";
            switch (city) {
                case "Hyderabad":
                    replyText = "🍛 Famous Hyderabadi Delicacies: World-famous Hyderabadi Dum Biryani (aromatic basmati rice with tender spiced mutton), hot Irani Chai paired with Osmania Butter Biscuits at Nimrah Cafe (facing Charminar), Haleem, and Double Ka Meetha sweet!";
                    break;
                case "Vijayawada":
                    replyText = "🌶️ Vijayawada Local Flavors: Authentic spicy Andhra Thali served on banana leaf with fresh hot rice, ghee, and Gongura Pachadi; steaming Idlis with Guntur Podi; crispy Mirchi Bajji; and Pulla Reddy Pootharekulu (paper sweets).";
                    break;
                case "Tirupati":
                    replyText = "🍯 Sacred Tirupati Prasad & Delicacies: The divine Tirupati GI-tagged Laddu (made with pure cow ghee, cashew, cardamom, and saffron); spicy Ghee Podi Thatte Idli; and traditional Satvik Andhra meals.";
                    break;
                case "Jaipur":
                    replyText = "🍲 Jaipur Royal Cuisines: Authentic Dal Baati Churma at Chokhi Dhani; spicy Pyaaz Kachori & Mawa Kachori at Rawat Mishtan Bhandar; rich Ghee Ghewar at LMB; and refreshing Ker Sangri sabzi.";
                    break;
                case "Agra":
                    replyText = "🍬 Agra Specialty Sweets: World-famous Agra Petha (Angoori, Kesar, and Chocolate flavors at Panchi Petha); crispy Bedmi Puri with spicy Aloo sabzi and Jalebi for morning breakfast.";
                    break;
                case "Goa":
                    replyText = "🐟 Goan Coastal Flavors: Fresh Goan Fish Curry with steamed rice; Prawn Balchão; Chicken Xacuti; Bebinca (multi-layered traditional coconut cake); and tender coconut water by the beach.";
                    break;
                default:
                    replyText = "🍲 Authentic Varanasi Street Food: Steaming hot Banarasi Kachori-Jalebi at Godowlia crossing; thick Malai Lassi in earthen Kulhad cups at Blue Lassi; Kashi Chaat Bhandar's hot Tamatar Chaat; winter delicacy Malaiyyo foam sweet; and iconic Banarasi Meetha Paan!";
                    break;
            }
        }
        // 4. Aarti & Darshan Timings
        else if (lower.contains("timing") || lower.contains("time") || lower.contains("aarti") || lower.contains("darshan") || lower.contains("open") || lower.contains("close")) {
            category = "Aarti & Darshan Timings";
            switch (city) {
                case "Hyderabad":
                    replyText = "⏰ Timings in Hyderabad: Charminar opens 09:00 AM – 05:30 PM daily. Golconda Fort Sound & Light Show: 06:30 PM (English) and 07:45 PM (Hindi). Birla Mandir: 07:00 AM – 12:00 PM & 03:00 PM – 09:00 PM.";
                    break;
                case "Vijayawada":
                    replyText = "⏰ Kanaka Durga Darshan Schedule: Dharma Darshanam (Free Entry): 04:00 AM – 09:00 PM. Special Abhishekam: 05:00 AM – 06:30 AM. Evening Nitya Archana: 06:30 PM – 07:30 PM.";
                    break;
                case "Tirupati":
                    replyText = "⏰ Tirumala Darshan Timings: Suprabhatam: 03:00 AM. Sarva Darshan (Free General Queue): 08:30 AM – 11:00 PM. Special Entry ₹300 Darshan tickets should be booked in advance on TTD official portal.";
                    break;
                case "Agra":
                    replyText = "⏰ Taj Mahal Visiting Hours: Opens 30 minutes before sunrise and closes 30 minutes before sunset (approx 06:00 AM – 06:30 PM). IMPORTANT: Taj Mahal is strictly CLOSED on FRIDAYS for prayers.";
                    break;
                default:
                    replyText = "⏰ Varanasi Aarti & Temple Schedule: Kashi Vishwanath Mangala Aarti: 03:00 AM – 04:00 AM. General Darshan: 04:00 AM – 11:00 PM. World-famous Grand Ganga Aarti at Dashashwamedh Ghat takes place every evening at 06:30 PM (arrive by 05:45 PM for best boat seating!).";
                    break;
            }
        }
        // 5. Transportation & How to Reach
        else if (lower.contains("reach") || lower.contains("transport") || lower.contains("auto") || lower.contains("cab") || lower.contains("metro") || lower.contains("how to go") || lower.contains("bus") || lower.contains("train") || lower.contains("direction")) {
            category = "Smart Transit & Navigation";
            replyText = "🚖 How to Navigate in " + city + ": " +
                    "From your current spot at " + locationContext + ": Local Auto-Rickshaws & E-Rickshaws charge standard rates (₹20 – ₹40 for 2-3km). " +
                    "You can also book app-based rides directly via Uber/Rapido or board city E-Buses. For scenic travel, authorized solar boats and heritage walking corridors offer direct traffic-free passage.";
        }
        // 6. FastPass & Ticket Booking
        else if (lower.contains("ticket") || lower.contains("pass") || lower.contains("fastpass") || lower.contains("book") || lower.contains("price") || lower.contains("cost") || lower.contains("fee")) {
            category = "Tickets & VIP FastPass";
            replyText = "🎫 Entry & VIP FastPass for " + city + ": General entry to ghats and temple complexes is free. For fast VIP darshan without waiting in queues, you can activate your FREE VIP FastPass directly using your Reward Points from the Tourtec Top Wallet!";
        }
        // 7. General Intelligent Multi-Turn Travel Guidance
        else {
            category = "Incredible India Travel Guide";
            replyText = "Namaste! Regarding \"" + query + "\" in " + city + " (" + locationContext + "): " +
                    "I am your real-time Incredible India AI Guide. The current footfall is optimal. I can assist you with temple dress codes, sacred Aarti timings, authentic street food spots, auto fares, and 1-click FastPass vouchers. How may I guide your journey?";
        }

        Map<String, Map<String, String>> greetings = new HashMap<>();
        Map<String, String> hi = new HashMap<>();
        hi.put("phrase", "नमस्ते (Namaste) / आपका स्वागत है (Aapka Swagat Hai)");
        hi.put("langName", "Hindi");
        greetings.put("hi", hi);

        Map<String, String> en = new HashMap<>();
        en.put("phrase", "Namaste! Welcome to Incredible India");
        en.put("langName", "English");
        greetings.put("en", en);

        Map<String, String> te = new HashMap<>();
        te.put("phrase", "నమస్కారం (Namaskaram) / స్వాగతం (Swagatam)");
        te.put("langName", "Telugu");
        greetings.put("te", te);

        Map<String, String> ta = new HashMap<>();
        ta.put("phrase", "வணக்கம் (Vanakkam) / நல்வரவு (Nalvaravu)");
        ta.put("langName", "Tamil");
        greetings.put("ta", ta);

        Map<String, String> selectedGreeting = greetings.getOrDefault(language, hi);

        List<String> questions = Arrays.asList(
            "What are the sacred dress codes & shoe rules here?",
            "Tell me the historical story of " + city,
            "Where can I taste the most famous authentic food in " + city + "?",
            "What are the best Aarti & Darshan timings today?"
        );

        return new AssistantQueryResponse(
            replyText,
            category,
            locationContext,
            language,
            selectedGreeting,
            true,
            questions
        );
    }

    @PostMapping("/ocr-translate")
    public Map<String, Object> ocrTranslate(@RequestBody(required = false) Map<String, String> payload) {
        String nativeText = payload != null && payload.containsKey("nativeText") ? payload.get("nativeText") : "श्री मंदिर प्रवेश नियमावली एवं जूता घर";

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("detectedText", nativeText);
        response.put("englishTranslation", "Temple Entry Protocol & Free Shoe Stand: Footwear strictly prohibited inside sanctum. Deposit shoes at Counter #1. Mobile phones on silent mode.");
        response.put("culturalInsight", "Traditional sacred discipline requires pure cotton attire and footwear removal before darshan.");
        response.put("confidenceScore", 0.99);
        return response;
    }
}
