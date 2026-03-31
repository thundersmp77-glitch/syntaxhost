import { Router } from 'express';
import { prisma } from '../prisma.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_, res) => {
  const plans = await prisma.plan.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(plans);
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const data = req.body;
  const plan = await prisma.plan.create({
    data: { ...data, priceInr: Number(data.priceInr), features: Array.isArray(data.features) ? data.features.join('\n') : data.features }
  });
  res.status(201).json(plan);
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body;
  const updated = await prisma.plan.update({
    where: { id },
    data: { ...data, priceInr: Number(data.priceInr), features: Array.isArray(data.features) ? data.features.join('\n') : data.features }
  });
  res.json(updated);
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  await prisma.plan.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

export default router;
