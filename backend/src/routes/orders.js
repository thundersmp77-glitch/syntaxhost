import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { prisma } from '../prisma.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { sendDiscordWebhook } from '../services/discord.js';

const router = Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`)
});
const upload = multer({ storage });

router.post('/', requireAuth, upload.single('screenshot'), async (req, res) => {
  const { planId, transactionId, paymentEmail } = req.body;
  if (!req.file) return res.status(400).json({ message: 'Screenshot required' });

  const plan = await prisma.plan.findUnique({ where: { id: Number(planId) } });
  if (!plan) return res.status(404).json({ message: 'Plan not found' });

  const order = await prisma.order.create({
    data: {
      planId: plan.id,
      userId: req.user.id,
      transactionId,
      paymentEmail,
      screenshotPath: `/uploads/${path.basename(req.file.path)}`,
      amountInr: plan.priceInr
    },
    include: { user: true, plan: true }
  });

  const webhook = await prisma.setting.findUnique({ where: { key: 'discord_webhook_url' } });
  await sendDiscordWebhook(webhook?.value, order);

  res.status(201).json(order);
});

router.get('/my', requireAuth, async (req, res) => {
  const orders = await prisma.order.findMany({ where: { userId: req.user.id }, include: { plan: true }, orderBy: { createdAt: 'desc' } });
  res.json(orders);
});

router.get('/', requireAuth, requireAdmin, async (req, res) => {
  const orders = await prisma.order.findMany({ include: { user: true, plan: true }, orderBy: { createdAt: 'desc' } });
  res.json(orders);
});

router.patch('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const order = await prisma.order.update({
    where: { id: Number(req.params.id) },
    data: { status: req.body.status }
  });
  res.json(order);
});

export default router;
