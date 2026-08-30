# TOURTEC INDIA - Spring Boot Backend (Spring Tool Suite / STS)

This is the complete **Java Spring Boot 3** backend for **TOURTEC INDIA | अतुल्य भारत Smart Tourism Suite**.

---

## 🛠️ How to Open & Run in Spring Tool Suite (STS)

### Option 1: Import as Existing Maven Project (Recommended)
1. Open **Spring Tools 4 (STS)**.
2. Click **`File`** ➔ **`Import...`**.
3. Expand **`Maven`** and select **`Existing Maven Projects`**, then click **`Next`**.
4. Click **`Browse...`** and select this directory:
   ```
   c:\Users\sathv\Downloads\TOURTEC\backend-spring
   ```
5. Ensure `pom.xml` is checked, then click **`Finish`**.
6. Wait 10–20 seconds for STS to resolve dependencies.
7. In the **Boot Dashboard** (bottom left of STS) or **Package Explorer**:
   - Right-click **`tourtec-backend`** or [`TourtecBackendApplication.java`](src/main/java/com/tourtec/TourtecBackendApplication.java)
   - Click **`Run As`** ➔ **`Spring Boot App`** (or press `Alt + Shift + X, B`).
8. The server will start on **`http://localhost:5000`**.

---

### Option 2: Open from File System
1. In STS, go to **`File`** ➔ **`Open Projects from File System...`**.
2. Set directory to `c:\Users\sathv\Downloads\TOURTEC\backend-spring`.
3. Click **`Finish`**.

---

## 🔌 API Endpoints Included

| Controller | Endpoint | Method | Functionality |
| :--- | :--- | :---: | :--- |
| `HealthController` | `/api/health` | `GET` | Health check & framework metadata |
| `DestinationController` | `/api/destinations` | `GET` | All 5 Indian corridors (Varanasi, Jaipur, Agra, Goa, Ladakh) |
| `DestinationController` | `/api/destinations/{id}` | `GET` | Single destination with zones and weather |
| `TelemetryController` | `/api/telemetry/live` | `GET` | Live IoT sensor readings across all active nodes |
| `RoadmapController` | `/api/roadmap/optimize` | `POST` | AI Route sequence recalculation to minimize wait times |
| `RoadmapController` | `/api/roadmap/pass` | `POST` | Generates Incredible India RFID & QR Travel Pass |
| `FlowDistributionController` | `/api/flow/redistribute` | `POST` | Autonomous crowd load balancer and diversion calculator |
| `FlowDistributionController` | `/api/flow/claim-voucher`| `POST` | Claim VIP FastPass Darshan vouchers |
| `AlertsController` | `/api/alerts` | `GET` | Active real-time safety and geofence alerts |
| `AlertsController` | `/api/alerts` | `POST` | Broadcast new geofenced advisory to all tourists |
| `AlertsController` | `/api/alerts/acknowledge` | `POST` | Acknowledge and dismiss active alert |
| `AssistantController` | `/api/assistant/query` | `POST` | Geolocation-aware AI narration in Hindi and regional languages |
| `AssistantController` | `/api/assistant/ocr-translate`| `POST`| AR Camera optical sign and menu translator |
| `SosController` | `/api/sos` | `POST` | Transmits live beacon to Tourist Police Mitra (1363 / 112) |
| `WalletController` | `/api/wallet/balance` | `GET` | Checks Eco-Rupee Pass balance and rewards catalog |
| `WalletController` | `/api/wallet/redeem` | `POST` | Redeems points for Kulhad Chai, Solar Boat passes & prasad coupons |

---

## 🌐 React Frontend Connection
The React frontend on `http://localhost:3000` is already configured with CORS and proxy to connect directly to this Spring Boot backend on port `5000`.
