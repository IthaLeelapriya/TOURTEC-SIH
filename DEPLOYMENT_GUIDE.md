# 🚀 TOURTEC INDIA - Production Deployment Guide

This guide provides step-by-step instructions to deploy the complete TOURTEC Full-Stack Application (**React Frontend + Node.js API + PostgreSQL Database**).

---

## 📋 Pre-Deployment Health & Audit Status

| Component | Status | Verification Details |
| :--- | :---: | :--- |
| **Frontend Bundle (Vite + React)** | ✅ PASS | 0 Errors, dynamic `API_BASE` support, responsive layout |
| **Backend API (Express.js)** | ✅ PASS | Health check `GET /api/health` ➔ 200 OK, CORS, security headers |
| **Database (PostgreSQL)** | ✅ PASS | Auto-schema migration, tables (`users`, `user_bookings`) |
| **Email/Password Auth** | ✅ PASS | Sign Up, Sign In, protected route guards |
| **Deployment Configs** | ✅ PASS | `render.yaml`, `vercel.json`, `Dockerfile`, `docker-compose.yml` |

---

## 🌟 Method 1: Deploy on Render.com (Recommended - 100% Free)

Render allows you to deploy the **Frontend, Backend, and PostgreSQL database** together in 1 click using `render.yaml`.

### Steps:
1. Push your TOURTEC repository to **GitHub** (`git push origin main`).
2. Go to 👉 **[dashboard.render.com](https://dashboard.render.com/)** and sign in.
3. Click **New +** ➔ Select **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically detect `render.yaml` and create:
   * 🐘 **`tourtec-db`**: Free PostgreSQL Database
   * 🚀 **`tourtec-backend`**: Free Node.js Web Service
   * 🌐 **`tourtec-frontend`**: Free Static React Web App
6. **Set manual environment variables** (see table below).
7. Click **Apply** ➔ Your live website will be up with HTTPS in ~3 minutes!

### Manual Environment Variables (Set in Render Dashboard):

| Variable | Service | Description |
| :--- | :--- | :--- |
| `FAST2SMS_API_KEY` | Backend | Your Fast2SMS Indian Gateway API Key (get from [fast2sms.com](https://www.fast2sms.com/)) |
| `FRONTEND_URL` | Backend | Your frontend URL (e.g., `https://tourtec-frontend.onrender.com`) — set after first deploy |

> **Note:** `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`, and `VITE_API_URL` are automatically configured by `render.yaml`.

---

## 🌟 Method 2: Deploy on Vercel + Render

### Step A: Deploy Backend + PostgreSQL on Render
1. Follow Method 1 steps 1-6 for backend and database only.
2. Copy your deployed backend URL (e.g., `https://tourtec-backend.onrender.com`).

### Step B: Deploy Frontend on Vercel
1. Go to 👉 **[vercel.com](https://vercel.com/)** ➔ **Add New Project**.
2. Select your repository.
3. Root Directory: `frontend`
4. Add Environment Variables:
   * `VITE_API_URL` = `tourtec-backend.onrender.com` (without `https://`)
5. Click **Deploy**!

---

## 🐳 Method 3: Deploy with Docker & Docker Compose

For deploying on AWS EC2, DigitalOcean Droplet, GCP Compute Engine, or Railway:

```bash
# 1. Clone repository
git clone <your-repo-url>
cd TOURTEC

# 2. Create a .env file with your secrets
echo "FAST2SMS_API_KEY=your_key_here" > .env
echo "POSTGRES_PASSWORD=your_secure_password" >> .env
echo "JWT_SECRET=$(openssl rand -hex 32)" >> .env

# 3. Build and start containers
docker compose --env-file .env up -d --build

# 4. View logs
docker compose logs -f
```

Your app will be running at **`http://<your-server-ip>:5000`** with PostgreSQL automatically configured on port **`5433`**!

---

## ⚙️ Summary of Environment Variables

| Variable | Required In | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Backend | PostgreSQL connection string (`postgres://user:pass@host:port/db`) |
| `PORT` | Backend | Server port (Default: `5000`) |
| `NODE_ENV` | Backend | `production` for live deployments |
| `JWT_SECRET` | Backend | Secret key for JWT token signing (auto-generated on Render) |
| `FRONTEND_URL` | Backend | Production frontend URL for CORS (e.g., `https://tourtec-frontend.onrender.com`) |
| `FAST2SMS_API_KEY` | Backend | Fast2SMS Indian Gateway API Key (Optional) |
| `VITE_API_URL` | Frontend | Backend host (without `https://`), e.g., `tourtec-backend.onrender.com` |

---

## 🔒 Security Notes

- **Never commit `.env` files to Git.** The `.gitignore` excludes them.
- **Rotate API keys** if they were ever exposed in Git history.
- The backend uses **HMAC-SHA256** signed JWTs with a server-side secret.
- In production, CORS is restricted to the configured `FRONTEND_URL`.
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `HSTS`) are set automatically.
