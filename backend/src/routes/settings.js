import { Router } from 'express';
import { prisma } from '../prisma.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/links', async (_, res) => {
  const links = await prisma.link.findMany({ orderBy: { label: 'asc' } });
  res.json(links);
});

router.put('/links/:key', requireAuth, requireAdmin, async (req, res) => {
  const link = await prisma.link.update({
    where: { key: req.params.key },
    data: { url: req.body.url, label: req.body.label }
  });
  res.json(link);
});

router.get('/currencies', async (_, res) => {
  const values = await prisma.setting.findMany({ where: { key: { in: ['currency_usd_rate', 'currency_eur_rate'] } } });
  const map = Object.fromEntries(values.map((v) => [v.key, Number(v.value)]));
  res.json({ inr: 1, usd: map.currency_usd_rate || 0.012, eur: map.currency_eur_rate || 0.011 });
});

router.put('/currencies', requireAuth, requireAdmin, async (req, res) => {
  await prisma.setting.update({ where: { key: 'currency_usd_rate' }, data: { value: String(req.body.usd) } });
  await prisma.setting.update({ where: { key: 'currency_eur_rate' }, data: { value: String(req.body.eur) } });
  res.json({ ok: true });
});

router.get('/webhook', requireAuth, requireAdmin, async (_, res) => {
  const webhook = await prisma.setting.findUnique({ where: { key: 'discord_webhook_url' } });
  res.json({ value: webhook?.value || '' });
});

router.put('/webhook', requireAuth, requireAdmin, async (req, res) => {
  const webhook = await prisma.setting.update({ where: { key: 'discord_webhook_url' }, data: { value: req.body.value || '' } });
  res.json(webhook);
});

export default router;
