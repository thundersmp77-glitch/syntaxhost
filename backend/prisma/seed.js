import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const defaultLinks = [
  { key: 'clientPanel', label: 'Client Panel', url: 'https://panel.syntaxhost.com' },
  { key: 'discord', label: 'Discord', url: 'https://discord.gg/V5tVyazx4H' },
  { key: 'youtube', label: 'YouTube', url: 'https://youtube.com/@syntaxhost' },
  { key: 'instagram', label: 'Instagram', url: 'https://instagram.com/syntaxhost' },
  { key: 'email', label: 'Email', url: 'mailto:support@syntaxhost.com' }
];

async function main() {
  const hashed = await bcrypt.hash('Admin@12345', 10);
  await prisma.user.upsert({
    where: { email: 'admin@syntaxhost.com' },
    update: {},
    create: {
      email: 'admin@syntaxhost.com',
      username: 'SyntaxHost Admin',
      role: 'ADMIN',
      password: hashed
    }
  });

  for (const link of defaultLinks) {
    await prisma.link.upsert({ where: { key: link.key }, update: link, create: link });
  }

  await prisma.setting.upsert({
    where: { key: 'currency_usd_rate' },
    update: { value: '0.012' },
    create: { key: 'currency_usd_rate', value: '0.012' }
  });

  await prisma.setting.upsert({
    where: { key: 'currency_eur_rate' },
    update: { value: '0.011' },
    create: { key: 'currency_eur_rate', value: '0.011' }
  });

  await prisma.setting.upsert({
    where: { key: 'discord_webhook_url' },
    update: {},
    create: { key: 'discord_webhook_url', value: '' }
  });

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
