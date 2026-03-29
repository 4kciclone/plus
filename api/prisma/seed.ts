import "dotenv/config";
import prisma from "../src/lib/prisma";

const plans = [
  { name: "Residencial 100 Mega", price: 79.90, category: "Residencial", speed: "100", features: "100% Fibra Óptica,Download Ilimitado", popular: false },
  { name: "Residencial 500 Mega", price: 109.90, category: "Residencial", speed: "500", features: "100% Fibra Óptica,Ideal para Família", popular: true },
  { name: "Residencial 800 Mega", price: 159.90, category: "Residencial", speed: "800", features: "100% Fibra Óptica,Ideal para Games", popular: false },
  { name: "Residencial 1 Giga", price: 199.90, category: "Residencial", speed: "1000", features: "100% Fibra Óptica,Ultra Velocidade", popular: false },

  { name: "Comercial 100 Mega", price: 119.90, category: "Comercial", speed: "100", features: "100% Fibra Óptica,Estabilidade Corporativa", popular: false },
  { name: "Comercial 300 Mega", price: 149.90, category: "Comercial", speed: "300", features: "100% Fibra Óptica,Alta Disponibilidade", popular: false },
  { name: "Comercial 500 Mega", price: 169.90, category: "Comercial", speed: "500", features: "100% Fibra Óptica,Suporte Empresarial Rápido", popular: true },
  { name: "Comercial 50 Mega + IP Válido", price: 239.90, category: "Comercial", speed: "50", features: "IP Fixo Válido,Rotas Dedicadas", popular: false },

  { name: "Combo 100 Mega + Streaming", price: 99.90, category: "Combo", speed: "100", features: "Paramount+,3 meses de Deezer", popular: false },
  { name: "Combo 500 Mega + Paramount", price: 129.90, category: "Combo", speed: "500", features: "Paramount+,Deezer", popular: true },
  { name: "Combo 500 Mega + Max", price: 129.90, category: "Combo", speed: "500", features: "Max Incluso,100% Fibra Óptica", popular: false },
  { name: "Combo 1 Giga + Completo", price: 199.90, category: "Combo", speed: "1000", features: "Paramount+,Deezer,Max,Ultra Velocidade", popular: false },

  { name: "TV + Streaming", price: 49.90, category: "Internet + TV", speed: null, features: "Plataforma de Canais,Conteúdo On-Demand", popular: false },
  { name: "Combo 150 Mega + TV", price: 99.90, category: "Internet + TV", speed: "150", features: "Internet Fibra 150 Mega,Plataforma de TV", popular: true },
  { name: "Rural 200 Mega + TV", price: 129.90, category: "Internet + TV", speed: "200", features: "Internet Rural 200 Mega,Plataforma de TV", popular: false },
];

async function seed() {
  console.log("🌱 Populando banco de dados com planos...");
  await prisma.plan.deleteMany();
  for (const plan of plans) {
    await prisma.plan.create({ data: plan as any });
  }
  console.log(`✅ ${plans.length} planos inseridos com sucesso!`);
  await prisma.$disconnect();
}

seed().catch(console.error);
