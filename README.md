# TOURTEC (Smart India Hackathon)

**TOURTEC** is a full-stack platform designed to modernize tourism experiences by combining intuitive front-end interfaces with robust back-end services. Built for the Smart India Hackathon (SIH), this project integrates interactive trip planning, seamless deployment, and containerized backend architectures.

---

## 🚀 Tech Stack

- **Frontend:** React / Vite, TypeScript, JavaScript, CSS3, HTML5
- **Backend:** Node.js / Express, Java (Spring Boot)
- **Database:** PostgreSQL / MongoDB (configured via Docker Compose)
- **Deployment & DevOps:** Docker, Docker Compose, Render (`render.yaml`), Vercel (`vercel.json`)

---

## 📁 Project Structure

```text
TOURTEC-SIH/
├── backend/                  # Node.js backend services & APIs
├── frontend/                 # React/TypeScript client-side application
├── tourtec-spring-backend/   # Java Spring Boot enterprise service
├── Dockerfile                # Root/service containerization
├── docker-compose.yml        # Multi-container local orchestration
├── render.yaml               # Render infrastructure & deploy config
├── vercel.json               # Vercel deployment routing & headers
├── DEPLOYMENT_GUIDE.md       # Step-by-step production setup
└── walkthrough.md            # Detailed feature & code walkthrough
