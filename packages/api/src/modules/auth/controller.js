const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/db');
const config = require('../../config');
const { authenticator } = require('otplib');

function signTokens(user) {
  const payload = { id: user.id, clientId: user.clientId, role: user.role };
  const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
  });
  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
  return { accessToken, refreshToken };
}

// POST /api/auth/register  — creates a CLIENT_ADMIN for a new Client tenant
async function register(req, res, next) {
  try {
    // Shape/format already validated by zod at the route layer.
    const { clientName, jurisdiction, email, password, firstName, lastName } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'An account with that email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // One transaction so a failure creating the user can't strand an
    // empty Client tenant behind it.
    const user = await prisma.$transaction(async (tx) => {
      const client = await tx.client.create({
        data: { name: clientName, jurisdiction, status: 'TRIAL' },
      });
      return tx.user.create({
        data: {
          clientId: client.id,
          email,
          passwordHash,
          firstName,
          lastName,
          role: 'CLIENT_ADMIN',
        },
      });
    });

    const tokens = signTokens(user);
    res.status(201).json({ user: { id: user.id, email: user.email }, ...tokens });
  } catch (err) {
    // Unique constraint — two registrations for the same email raced.
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'An account with that email already exists' });
    }
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (user.mfaEnabled) {
      // TODO: short-lived "mfa_pending" token + separate /auth/mfa/verify step
      return res.status(200).json({ mfaRequired: true, userId: user.id });
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const tokens = signTokens(user);
    res.json({ user: { id: user.id, email: user.email, role: user.role }, ...tokens });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/refresh
async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'Missing refresh token' });
    const payload = jwt.verify(refreshToken, config.jwt.refreshSecret);

    // Re-read the user rather than trusting the token's claims: a deactivated
    // account or a changed role must not survive on an old refresh token.
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Account is no longer active' });
    }

    const tokens = signTokens(user);
    res.json(tokens);
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
}

// GET /api/auth/me
async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, clientId: true },
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/mfa/setup
async function setupMfa(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const secret = authenticator.generateSecret();
    await prisma.user.update({
      where: { id: user.id },
      data: { mfaSecret: secret }
    });
    
    const uri = authenticator.keyuri(user.email, 'Apex Veritas', secret);
    res.json({ secret, uri });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/mfa/verify
async function verifyMfa(req, res, next) {
  try {
    const { userId, token } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) return res.status(401).json({ error: 'Invalid user' });
    
    const isValid = authenticator.verify({ token, secret: user.mfaSecret });
    if (!isValid) return res.status(401).json({ error: 'Invalid token' });
    
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const tokens = signTokens(user);
    res.json({ user: { id: user.id, email: user.email, role: user.role }, ...tokens });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/mfa/enable
async function enableMfa(req, res, next) {
  try {
    const { token } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const isValid = authenticator.verify({ token, secret: user.mfaSecret });
    if (!isValid) return res.status(401).json({ error: 'Invalid token' });
    
    await prisma.user.update({
      where: { id: user.id },
      data: { mfaEnabled: true }
    });
    
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, me, setupMfa, verifyMfa, enableMfa };
