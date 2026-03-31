import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_g0hZtNY6Fveo@ep-black-water-a8x3ol5s-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"
    }
  }
});

async function main() {
  const plans = [
    { name: "100 Mega", price: 79.9, category: "Residencial", speed: "100", popular: false, features: "100% Fibra Óptica, Download Ilimitado" },
    { name: "500 Mega", price: 109.9, category: "Residencial", speed: "500", popular: true, features: "100% Fibra Óptica, Ideal para Família" },
    { name: "800 Mega", price: 159.9, category: "Residencial", speed: "800", popular: false, features: "100% Fibra Óptica, Ideal para Games" },
    { name: "1 Giga", price: 199.9, category: "Residencial", speed: "1G", popular: false, features: "100% Fibra Óptica, Ultra Velocidade" },
    { name: "100 Mega", price: 119.9, category: "Comercial", speed: "100", popular: false, features: "100% Fibra Óptica, Estabilidade Corporativa" },
    { name: "300 Mega", price: 149.9, category: "Comercial", speed: "300", popular: false, features: "100% Fibra Óptica, Alta Disponibilidade" },
    { name: "500 Mega", price: 169.9, category: "Comercial", speed: "500", popular: true, features: "100% Fibra Óptica, Suporte Empresarial Rápido" },
    { name: "50 Mega + IP Válido", price: 239.9, category: "Comercial", speed: "50", popular: false, features: "IP Fixo Válido, Rotas Dedicadas" },
    { name: "100 Mega + Streaming", price: 99.9, category: "Combo", speed: "100", popular: false, features: "Paramount+, 3 meses de Deezer" },
    { name: "500 Mega + Paramount", price: 129.9, category: "Combo", speed: "500", popular: true, features: "Paramount+, Deezer" },
    { name: "500 Mega + Max", price: 129.9, category: "Combo", speed: "500", popular: false, features: "Max Incluso, 100% Fibra Óptica" },
    { name: "1 Giga + Completo", price: 199.9, category: "Combo", speed: "1G", popular: false, features: "Paramount+, Deezer, Max, Ultra Velocidade" },
    { name: "TV + Streaming", price: 49.9, category: "Internet + TV", speed: "", popular: false, features: "Plataforma de Canais, Conteúdo On-Demand" },
    { name: "Combo 150 Mega + TV", price: 99.9, category: "Internet + TV", speed: "150", popular: true, features: "Internet Fibra 150 Mega, Plataforma de TV" },
    { name: "Rural 200 Mega + TV", price: 129.9, category: "Internet + TV", speed: "200", popular: false, features: "Internet Rural 200 Mega, Plataforma de TV" }
  ];

  console.log('Seeding plans into Neon DB...');
  for (const p of plans) {
    await prisma.plan.create({ data: p });
  }
  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
