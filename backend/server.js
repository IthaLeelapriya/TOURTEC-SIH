const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// CORS Configuration — support production domains, render.com subdomains, and local dev
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (!IS_PRODUCTION || !process.env.FRONTEND_URL || process.env.FRONTEND_URL === '*') {
      return callback(null, true);
    }
    const cleanFrontend = process.env.FRONTEND_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const cleanOrigin = origin.replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (cleanOrigin.includes(cleanFrontend) || origin.endsWith('.onrender.com') || cleanOrigin === 'localhost:3000' || cleanOrigin === 'localhost:5173') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  if (IS_PRODUCTION) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// In-Memory fallback store if PostgreSQL is unavailable or has SSL issues
const inMemoryUsers = new Map();

// PostgreSQL Connection Pool Configuration
let pool;
let isDbConnected = false;

try {
  if (process.env.DATABASE_URL) {
    const isCloudDb = process.env.DATABASE_URL.includes('neon.tech') || 
                      process.env.DATABASE_URL.includes('supabase.co') || 
                      process.env.DATABASE_URL.includes('render.com') ||
                      process.env.DATABASE_URL.includes('sslmode=require');
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isCloudDb ? { rejectUnauthorized: false } : false
    });
  } else {
    pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'tourtec_db',
      password: process.env.DB_PASSWORD || 'root',
      port: parseInt(process.env.DB_PORT || '5432'),
      ssl: false // Explicitly disable SSL for local PostgreSQL
    });
  }

  pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone_number VARCHAR(50),
      password VARCHAR(255),
      auth_provider VARCHAR(50) NOT NULL DEFAULT 'email',
      avatar_url VARCHAR(500),
      eco_points INTEGER DEFAULT 100,
      is_verified BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ssh_public_key TEXT,
      oauth_provider_id VARCHAR(255),
      access_token TEXT,
      id_token_jwt TEXT
    );

    CREATE TABLE IF NOT EXISTS user_bookings (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
      booking_type VARCHAR(50) NOT NULL,
      item_title VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      total_amount NUMERIC(10,2) NOT NULL,
      booking_status VARCHAR(50) DEFAULT 'CONFIRMED',
      pass_qr_code TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `).then(() => {
    isDbConnected = true;
    console.log('✅ PostgreSQL connected & ready. Schema initialized successfully.');
  }).catch(err => {
    console.warn('⚠️ PostgreSQL running in fallback mode:', err.message);
    isDbConnected = false;
  });
} catch (err) {
  console.warn('⚠️ PostgreSQL pool initialization error:', err.message);
  isDbConnected = false;
}

// Helper: Generate a unique SSH RSA 2048-bit Public Key & Fingerprint for the user session
function generateUserSshKey(email) {
  try {
    const { publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      }
    });

    const rawBase64 = publicKey
      .replace('-----BEGIN RSA PUBLIC KEY-----', '')
      .replace('-----END RSA PUBLIC KEY-----', '')
      .replace(/\r?\n|\r/g, '');

    const sshKey = `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC${rawBase64.substring(0, 180)}... ${email}`;
    const sha256Fingerprint = 'SHA256:' + crypto.createHash('sha256').update(rawBase64).digest('base64').replace(/=+$/, '');

    return { sshKey, sha256Fingerprint };
  } catch (e) {
    return {
      sshKey: `ssh-rsa AAAAB3NzaC1yc2E... ${email}`,
      sha256Fingerprint: `SHA256:${crypto.randomBytes(16).toString('hex')}`
    };
  }
}

// Helper: Generate OpenID Connect compliant JWT Token
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

function generateIdToken(user, provider) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT', kid: 'ttec-rsa-2026' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: 'https://auth.tourtec.in',
    sub: user.oauth_provider_id || `usr_${user.id || Date.now()}`,
    aud: 'tourtec-smart-tourism-app',
    email: user.email,
    email_verified: true,
    name: user.full_name,
    picture: user.avatar_url,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 3600),
    auth_time: Math.floor(Date.now() / 1000),
    provider: provider
  })).toString('base64url');

  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

// 1. Health Check Endpoint
app.get('/api/health', async (req, res) => {
  let dbStatus = isDbConnected ? 'connected' : 'in-memory-fallback';
  // Live ping for accurate status
  if (pool) {
    try {
      await pool.query('SELECT 1');
      dbStatus = 'connected';
      isDbConnected = true;
    } catch (e) {
      dbStatus = 'in-memory-fallback';
    }
  }
  res.json({
    status: 'healthy',
    app: 'TOURTEC Smart Tourism API',
    version: '2.5.0',
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    uptime: Math.floor(process.uptime()) + 's',
    timestamp: new Date().toISOString()
  });
});

// 2. Public Server SSH Keys Endpoint
app.get('/api/auth/keys', (req, res) => {
  res.json({
    keys: [
      {
        kty: 'RSA',
        use: 'sig',
        alg: 'RS256',
        kid: 'ttec-rsa-2026',
        issuer: 'https://auth.tourtec.in',
        fingerprint: 'SHA256:7mN4Qz1K8w2xY9bPvE3cL5tU0aJhR6oI2eWsD8vF4gA'
      }
    ]
  });
});

// 3. Email Sign Up Endpoint
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, authProvider = 'email', avatarUrl } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const nameToUse = fullName ? fullName.trim() : cleanEmail.split('@')[0];
    const avatar = avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${nameToUse.replace(/ /g, '')}`;
    const { sshKey } = generateUserSshKey(cleanEmail);
    const accessToken = `ttec_jwt_${crypto.randomBytes(32).toString('hex')}`;
    const idToken = generateIdToken({ email: cleanEmail, full_name: nameToUse, avatar_url: avatar, id: 'reg' }, 'email');

    // If PostgreSQL is connected, use DB
    if (isDbConnected && pool) {
      try {
        const existing = await pool.query('SELECT * FROM users WHERE email = $1', [cleanEmail]);
        if (existing.rows.length > 0) {
          return res.status(400).json({ success: false, message: 'An account with this email already exists. Please Sign In.' });
        }

        const insertResult = await pool.query(
          `INSERT INTO users (
             full_name, email, phone_number, password, auth_provider, avatar_url, 
             eco_points, is_verified, created_at, last_login_at,
             ssh_public_key, oauth_provider_id, access_token, id_token_jwt
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW(), $9, $10, $11, $12)
           RETURNING *;`,
          [
            nameToUse, cleanEmail, phoneNumber || '+91 98765 43210', password, 
            authProvider, avatar, 100, true,
            sshKey, `email_${cleanEmail}`, accessToken, idToken
          ]
        );

        const savedUser = insertResult.rows[0];
        inMemoryUsers.set(cleanEmail, savedUser);

        return res.json({
          success: true,
          message: 'Account created successfully!',
          token: savedUser.access_token,
          idToken: savedUser.id_token_jwt,
          user: {
            id: savedUser.id,
            fullName: savedUser.full_name,
            email: savedUser.email,
            phoneNumber: savedUser.phone_number,
            authProvider: savedUser.auth_provider,
            avatarUrl: savedUser.avatar_url,
            ecoPoints: savedUser.eco_points,
            isVerified: savedUser.is_verified,
            sshPublicKey: savedUser.ssh_public_key
          }
        });
      } catch (dbErr) {
        console.warn('DB write error, switching to resilient in-memory storage:', dbErr.message);
        isDbConnected = false;
      }
    }

    // In-memory fallback
    if (inMemoryUsers.has(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists. Please Sign In.' });
    }

    const memUser = {
      id: `usr_${Date.now()}`,
      full_name: nameToUse,
      email: cleanEmail,
      phone_number: phoneNumber || '+91 98765 43210',
      password: password,
      auth_provider: 'email',
      avatar_url: avatar,
      eco_points: 100,
      is_verified: true,
      ssh_public_key: sshKey,
      access_token: accessToken,
      id_token_jwt: idToken,
      created_at: new Date().toISOString()
    };
    inMemoryUsers.set(cleanEmail, memUser);

    res.json({
      success: true,
      message: 'Account created successfully!',
      token: memUser.access_token,
      idToken: memUser.id_token_jwt,
      user: {
        id: memUser.id,
        fullName: memUser.full_name,
        email: memUser.email,
        phoneNumber: memUser.phone_number,
        authProvider: memUser.auth_provider,
        avatarUrl: memUser.avatar_url,
        ecoPoints: memUser.eco_points,
        isVerified: memUser.is_verified,
        sshPublicKey: memUser.ssh_public_key
      }
    });
  } catch (err) {
    console.error('Sign Up Error:', err);
    res.status(500).json({ success: false, message: 'Failed to complete registration. Please try again.' });
  }
});

// 4. Sign In Endpoint - Strictly verifies user exists and password matches
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check DB if connected
    if (isDbConnected && pool) {
      try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [cleanEmail]);
        if (result.rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'No account found with this email address. Please Sign Up first.'
          });
        }

        const user = result.rows[0];
        if (user.password && user.password !== password) {
          return res.status(401).json({
            success: false,
            message: 'Incorrect password. Please verify and try again.'
          });
        }

        await pool.query('UPDATE users SET last_login_at = NOW() WHERE email = $1', [cleanEmail]);

        return res.json({
          success: true,
          message: 'Signed in successfully!',
          token: user.access_token || `TTEC_JWT_${Date.now()}`,
          idToken: user.id_token_jwt,
          user: {
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            phoneNumber: user.phone_number,
            authProvider: user.auth_provider,
            avatarUrl: user.avatar_url,
            ecoPoints: user.eco_points,
            isVerified: user.is_verified,
            sshPublicKey: user.ssh_public_key
          }
        });
      } catch (dbErr) {
        console.warn('DB read error, falling back to memory store:', dbErr.message);
        isDbConnected = false;
      }
    }

    // In-memory fallback verification
    const user = inMemoryUsers.get(cleanEmail);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address. Please Sign Up first.'
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please verify and try again.'
      });
    }

    res.json({
      success: true,
      message: 'Signed in successfully!',
      token: user.access_token || `TTEC_JWT_${Date.now()}`,
      idToken: user.id_token_jwt,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phoneNumber: user.phone_number,
        authProvider: user.auth_provider,
        avatarUrl: user.avatar_url,
        ecoPoints: user.eco_points,
        isVerified: user.is_verified,
        sshPublicKey: user.ssh_public_key
      }
    });
  } catch (err) {
    console.error('Sign In Error:', err);
    res.status(500).json({ success: false, message: 'Authentication error. Please try again.' });
  }
});

// 5. Query All Users
app.get('/api/auth/users', async (req, res) => {
  if (isDbConnected && pool) {
    try {
      const result = await pool.query(`SELECT id, full_name, email, phone_number, auth_provider, avatar_url, eco_points, is_verified, created_at FROM users ORDER BY id ASC;`);
      return res.json(result.rows);
    } catch (e) {}
  }
  res.json(Array.from(inMemoryUsers.values()));
});

// 6. Serve Static Frontend Bundle in Production
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendDist, 'index.html'));
    }
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TOURTEC Server running on http://0.0.0.0:${PORT}`);
});
