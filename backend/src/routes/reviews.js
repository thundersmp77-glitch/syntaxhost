import { Router } from 'express';
import { prisma } from '../prisma.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_, res) => {
  const reviews = await prisma.review.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });
  res.json(reviews);
});

router.post('/', requireAuth, async (req, res) => {
  const { message, rating } = req.body;
  const review = await prisma.review.create({
    data: { message, rating: Number(rating), userId: req.user.id },
    include: { user: true }
  });
  res.status(201).json(review);
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  await prisma.review.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

export default router;
