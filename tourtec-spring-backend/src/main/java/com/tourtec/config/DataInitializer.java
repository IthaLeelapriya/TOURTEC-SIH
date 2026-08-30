package com.tourtec.config;

import com.tourtec.entity.AlertEntity;
import com.tourtec.entity.DestinationEntity;
import com.tourtec.entity.ZoneEntity;
import com.tourtec.repository.AlertRepository;
import com.tourtec.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private DestinationRepository destinationRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Override
    public void run(String... args) {
        if (destinationRepository.count() == 0) {
            System.out.println("🐘 Seeding Indian Heritage Destinations into PostgreSQL...");

            // 1. Varanasi
            DestinationEntity varanasi = new DestinationEntity(
                "varanasi", "Varanasi Sacred Ghats & Heritage Corridor", "India", "🇮🇳",
                25.3176, 83.0062, 15, "Timeless Spiritual Ghats, Kashi Vishwanath & Ganga Aarti",
                "28°C", "Pleasant & Hazy Sun", "52%", "32 (Good)", "Moderate",
                14850, "92/100", "66 dB", "3.4 km/h", "78%", "234 pings/min", "12ms"
            );
            varanasi.addZone(new ZoneEntity("vz1", "Dashashwamedh Ghat (Ganga Aarti)", 25.3072, 83.0104, 6500, 6150, "Critical (95%)", "50 mins", "overcrowded", 0));
            varanasi.addZone(new ZoneEntity("vz2", "Kashi Vishwanath Temple Corridor", 25.3109, 83.0107, 5000, 4100, "High (82%)", "35 mins", "heavy", 10));
            varanasi.addZone(new ZoneEntity("vz3", "Assi Ghat Cultural Plaza", 25.2917, 83.0039, 4000, 2100, "Moderate (52%)", "10 mins", "optimal", 25));
            varanasi.addZone(new ZoneEntity("vz4", "Sarnath Dhamek Stupa & Deer Park", 25.3811, 83.0214, 3000, 620, "Low (21%)", "0 mins", "recommended", 50));
            varanasi.addZone(new ZoneEntity("vz5", "Chet Singh Ghat Historic Fort Promenade", 25.2989, 83.0069, 2500, 510, "Low (20%)", "0 mins", "recommended", 45));

            // 2. Jaipur
            DestinationEntity jaipur = new DestinationEntity(
                "jaipur", "Jaipur Pink City & Royal Forts Corridor", "India", "🇮🇳",
                26.9124, 75.7873, 14, "Amber Fort, Hawa Mahal & UNESCO Stepwells",
                "31°C", "Sunny & Dry", "38%", "42 (Moderate)", "High",
                16900, "86/100", "68 dB", "3.6 km/h", "74%", "210 pings/min", "14ms"
            );
            jaipur.addZone(new ZoneEntity("jz1", "Hawa Mahal Palace of Winds", 26.9239, 75.8267, 4500, 4250, "Critical (94%)", "40 mins", "overcrowded", 0));
            jaipur.addZone(new ZoneEntity("jz2", "Amber Fort & Maota Lake", 26.9855, 75.8513, 6000, 5280, "Critical (88%)", "55 mins", "overcrowded", 5));
            jaipur.addZone(new ZoneEntity("jz3", "City Palace & Jantar Mantar Observatory", 26.9258, 75.8237, 3500, 2050, "Moderate (58%)", "15 mins", "optimal", 20));
            jaipur.addZone(new ZoneEntity("jz4", "Panna Meena Ka Kund Stepwell", 26.9877, 75.8569, 2000, 380, "Low (19%)", "0 mins", "recommended", 45));
            jaipur.addZone(new ZoneEntity("jz5", "Nahargarh Fort Sunset Ridge", 26.9374, 75.8155, 3000, 710, "Low (24%)", "0 mins", "recommended", 40));

            // 3. Agra
            DestinationEntity agra = new DestinationEntity(
                "agra", "Agra Taj Mahal & Mughal Heritage Corridor", "India", "🇮🇳",
                27.1751, 78.0421, 14, "Taj Mahal Monument of Love, Agra Fort & Mehtab Bagh",
                "30°C", "Sunny & Clear", "44%", "36 (Good)", "High",
                19800, "89/100", "60 dB", "3.5 km/h", "71%", "280 pings/min", "11ms"
            );
            agra.addZone(new ZoneEntity("az1", "Taj Mahal Main Complex", 27.1751, 78.0421, 8000, 7700, "Critical (96%)", "65 mins", "overcrowded", 0));
            agra.addZone(new ZoneEntity("az2", "Agra Fort Diwan-i-Khas", 27.1795, 78.0211, 5000, 3800, "High (76%)", "30 mins", "heavy", 10));
            agra.addZone(new ZoneEntity("az3", "Mehtab Bagh Moonlight Riverfront Garden", 27.1800, 78.0422, 3000, 650, "Low (22%)", "0 mins", "recommended", 50));
            agra.addZone(new ZoneEntity("az4", "Itmad-ud-Daulah (Baby Taj)", 27.1929, 78.0310, 2500, 450, "Low (18%)", "0 mins", "recommended", 45));
            agra.addZone(new ZoneEntity("az5", "Fatehpur Sikri Imperial Gateway", 27.0945, 77.6679, 4000, 980, "Low (25%)", "5 mins", "recommended", 40));

            // 4. Goa
            DestinationEntity goa = new DestinationEntity(
                "goa", "Goa Coastal & Heritage Latin Corridor", "India", "🇮🇳",
                15.4989, 73.8278, 13, "Latin Quarter, UNESCO Basilicas & Serene Coastal Islands",
                "29°C", "Tropical Coastal Breeze", "68%", "18 (Pristine)", "High",
                12400, "94/100", "54 dB", "4.1 km/h", "82%", "190 pings/min", "15ms"
            );
            goa.addZone(new ZoneEntity("gz1", "Baga & Calangute Beach Strip", 15.5553, 73.7517, 7000, 6650, "Critical (95%)", "45 mins", "overcrowded", 0));
            goa.addZone(new ZoneEntity("gz2", "Basilica of Bom Jesus (Old Goa)", 15.5008, 73.9116, 4000, 2850, "High (71%)", "25 mins", "heavy", 15));
            goa.addZone(new ZoneEntity("gz3", "Fontainhas Heritage Latin Quarter", 15.4989, 73.8322, 3000, 1350, "Moderate (45%)", "5 mins", "optimal", 25));
            goa.addZone(new ZoneEntity("gz4", "Divar Island Eco-Village", 15.5186, 73.9056, 2000, 310, "Low (16%)", "0 mins", "recommended", 50));
            goa.addZone(new ZoneEntity("gz5", "Cabo de Rama Historic Cliff Fort", 15.0894, 73.9214, 1500, 270, "Low (18%)", "0 mins", "recommended", 45));

            // 5. Ladakh
            DestinationEntity ladakh = new DestinationEntity(
                "ladakh", "Ladakh High-Altitude Himalayan Corridor", "India", "🇮🇳",
                34.1526, 77.5771, 12, "Pangong Lake, Monasteries & High-Altitude Eco-Trails",
                "16°C", "Crisp Mountain Air", "28%", "6 (Pristine)", "Very High",
                6200, "98/100", "38 dB", "3.1 km/h", "89%", "140 pings/min", "24ms"
            );
            ladakh.addZone(new ZoneEntity("lz1", "Pangong Tso Turquoise Shore", 33.7595, 78.6674, 2500, 2100, "High (84%)", "30 mins", "heavy", 5));
            ladakh.addZone(new ZoneEntity("lz2", "Shanti Stupa Panoramic Ridge", 34.1648, 77.5786, 2000, 1100, "Moderate (55%)", "10 mins", "optimal", 20));
            ladakh.addZone(new ZoneEntity("lz3", "Thiksey Monastery Hilltop Sanctuary", 34.0583, 77.6667, 2200, 880, "Moderate (40%)", "5 mins", "optimal", 30));
            ladakh.addZone(new ZoneEntity("lz4", "Hemis National Park & Monastery", 33.9128, 77.7064, 1800, 320, "Low (18%)", "0 mins", "recommended", 50));

            destinationRepository.saveAll(Arrays.asList(varanasi, jaipur, agra, goa, ladakh));
            System.out.println("✓ 5 Indian Destinations & Zones seeded into PostgreSQL!");
        }

        if (alertRepository.count() == 0) {
            alertRepository.saveAll(Arrays.asList(
                new AlertEntity("alt-ind-1", "varanasi", "crowd_surge", "danger", "Maha Ganga Aarti Surge Alert at Dashashwamedh", "Dashashwamedh Ghat has reached 95% capacity. Darshan wait times currently exceed 50 minutes. Police Mitra recommends taking the solar boat diversion to Chet Singh or Assi Ghat.", "2 mins ago", true, 25.3072, 83.0104, 400),
                new AlertEntity("alt-ind-2", "varanasi", "geofence", "warning", "Kashi Vishwanath Security Locker Mandatory Protocol", "Mobile phones, leather accessories, and bags are prohibited inside Gate #4. Please deposit items at free Smart RFID Lockers at Gate 4 before entering the corridor.", "14 mins ago", true, 25.3109, 83.0107, 300),
                new AlertEntity("alt-ind-3", "jaipur", "weather", "warning", "Aravalli Afternoon Heat Advisory", "Temperatures rising above 34°C at Amber Fort uphill climb. Free hydration & cool mist stations active along Panna Meena Stepwell passage.", "25 mins ago", true, 26.9855, 75.8513, 600)
            ));
            System.out.println("✓ Safety Geofence Alerts seeded into PostgreSQL!");
        }
    }
}
