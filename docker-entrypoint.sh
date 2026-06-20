#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma db push --skip-generate 2>/dev/null || true

echo "Seeding database..."
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  const count = await prisma.user.count();
  if (count > 0) {
    console.log('Database already seeded, skipping...');
    return;
  }
  
  console.log('Seeding database...');
  
  const users = [
    {
      name: '小王 (Xiao Wang)',
      email: 'wang@demo.com',
      password: await bcrypt.hash('demo123', 10),
      experience: 'beginner',
      preferences: { cuisine: [], region: [] },
    },
    {
      name: '李姐 (Li Jie)',
      email: 'li@demo.com',
      password: await bcrypt.hash('demo123', 10),
      experience: 'intermediate',
      preferences: { cuisine: ['sichuan'], region: ['chengdu'] },
    },
    {
      name: '张总 (Zhang Zong)',
      email: 'zhang@demo.com',
      password: await bcrypt.hash('demo123', 10),
      experience: 'expert',
      preferences: { cuisine: ['hotpot'], region: ['beijing'] },
    },
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  const sauces = [
    { name: 'Chili Garlic Sauce', nameZh: '蒜蓉辣酱', description: 'A versatile chili sauce with bold garlic flavor.', category: 'chili', pairingGuide: { cuisines: ['sichuan', 'cantonese'], dishes: ['宫保鸡丁', '麻婆豆腐'], tips: ['Add during cooking for heat and garlic flavor'] } },
    { name: 'Sriracha', nameZh: '是拉差辣酱', description: 'Smooth, slightly sweet chili sauce with garlic undertones.', category: 'chili', pairingGuide: { cuisines: ['thai', 'vietnamese'], dishes: ['春卷', '越南河粉'], tips: ['Excellent as a finishing sauce'] } },
    { name: 'Sambal Oelek', nameZh: '叁巴酱', description: 'Traditional Indonesian chili paste.', category: 'chili', pairingGuide: { cuisines: ['indonesian', 'malaysian'], dishes: ['沙爹', '炒粿条'], tips: ['Use as a cooking base for curries'] } },
    { name: 'Premium Soy Sauce', nameZh: '生抽', description: 'Light soy sauce for seasoning and dipping.', category: 'soy', pairingGuide: { cuisines: ['chinese', 'japanese'], dishes: ['蒸鱼', '炒青菜'], tips: ['Add at the end of cooking to preserve flavor'] } },
    { name: 'Mushroom Soy Sauce', nameZh: '草菇酱油', description: 'Dark soy sauce infused with mushroom extract.', category: 'soy', pairingGuide: { cuisines: ['chinese'], dishes: ['红烧肉', '炒面'], tips: ['Use for color in braised dishes'] } },
    { name: 'Classic Oyster Sauce', nameZh: '蚝油', description: 'Rich, savory sauce made from oyster extracts.', category: 'oyster', pairingGuide: { cuisines: ['cantonese'], dishes: ['蚝油生菜', '炒牛肉'], tips: ['Essential for beef and broccoli stir-fry'] } },
    { name: 'Mushroom Oyster Sauce', nameZh: '素蚝油', description: 'Vegetarian oyster sauce made from mushrooms.', category: 'oyster', pairingGuide: { cuisines: ['vegetarian'], dishes: ['素炒', '豆腐'], tips: ['Perfect for vegetarian dishes'] } },
    { name: 'Hoisin Sauce', nameZh: '海鲜酱', description: 'Sweet and savory sauce with five-spice notes.', category: 'hoisin', pairingGuide: { cuisines: ['cantonese', 'peking'], dishes: ['北京烤鸭', '春卷'], tips: ['Essential condiment for Peking duck wraps'] } },
    { name: 'Chinese BBQ Sauce', nameZh: '烧烤酱', description: 'Sweet and sticky sauce for grilling and roasting.', category: 'hoisin', pairingGuide: { cuisines: ['cantonese'], dishes: ['叉烧', '烤肉'], tips: ['Marinate meat for at least 2 hours'] } },
    { name: 'Doubanjiang', nameZh: '豆瓣酱', description: 'Fermented chili bean paste from Sichuan.', category: 'specialty', pairingGuide: { cuisines: ['sichuan'], dishes: ['麻婆豆腐', '回锅肉'], tips: ['Fry in oil first to release aroma'] } },
    { name: 'Fermented Black Bean', nameZh: '豆豉', description: 'Fermented black soybeans with intense savory flavor.', category: 'specialty', pairingGuide: { cuisines: ['cantonese'], dishes: ['豆豉鲮鱼', '排骨'], tips: ['Rinse before use to reduce saltiness'] } },
    { name: 'Sweet Chili Sauce', nameZh: '甜辣酱', description: 'Mild, sweet chili sauce with tangy notes.', category: 'specialty', pairingGuide: { cuisines: ['thai', 'vietnamese'], dishes: ['炸虾', '春卷'], tips: ['Perfect dipping sauce for fried foods'] } },
  ];

  for (const sauce of sauces) {
    await prisma.sauceKB.create({ data: sauce });
  }

  console.log('Seeding complete!');
}

seed()
  .catch(console.error)
  .finally(() => prisma.\$disconnect());
"

echo "Starting application..."
exec node server.js
