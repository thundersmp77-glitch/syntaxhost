import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function makeToken(user) {
  return jwt.sign({ id: user.id, role: user.role, email: user.email, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
}

router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) return res.status(400).json({ message: 'Missing fields' });

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashed, username } });
  return res.json({ token: makeToken(user), user: { id: user.id, email: user.email, role: user.role, username: user.username } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  return res.json({ token: makeToken(user), user: { id: user.id, email: user.email, role: user.role, username: user.username } });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, email: true, role: true, username: true } });
  res.json({ user });
});

export default router;
