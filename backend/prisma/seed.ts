import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@agentforge.ai' },
    update: {},
    create: { email: 'demo@agentforge.ai', name: 'Demo User', passwordHash, emailVerified: true },
  });
  const existing = await prisma.organizationMember.findFirst({ where: { userId: user.id } });
  if (!existing) {
    await prisma.organization.create({
      data: {
        name: 'Demo Company',
        industry: 'Software',
        description: 'Seeded demo company',
        members: { create: { userId: user.id, role: 'OWNER' } },
        departments: { create: [{ name: 'Software Development' }, { name: 'Marketing' }] },
      },
    });
  }
  console.log('Seed complete: demo@agentforge.ai / Password123!');
}

main().finally(() => prisma.$disconnect());
