import { PrismaClient, Role, InquiryStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding British Merchants database...");

  // 1. Seed Super Admin
  const adminPassword = await bcrypt.hash("AdminPassword2026!", 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@britishmerchants.com" },
    update: {
      password: adminPassword,
      role: Role.SUPER_ADMIN,
    },
    create: {
      email: "admin@britishmerchants.com",
      name: "Super Admin",
      password: adminPassword,
      role: Role.SUPER_ADMIN,
    },
  });
  console.log("Super Admin seeded:", superAdmin.email);

  // 2. Seed Customer / Viewer
  const viewerPassword = await bcrypt.hash("ViewerPassword2026!", 10);
  const viewer = await prisma.user.upsert({
    where: { email: "viewer@britishmerchants.com" },
    update: {
      password: viewerPassword,
      role: Role.CUSTOMER,
    },
    create: {
      email: "viewer@britishmerchants.com",
      name: "Trade Client (Viewer)",
      password: viewerPassword,
      role: Role.CUSTOMER,
    },
  });
  console.log("Viewer / Customer seeded:", viewer.email);

  // 3. Seed Default Services
  const initialServices = [
    {
      slug: "grocery",
      name: "Fresh Grocery",
      desc: "Quality essentials delivered fresh and on time.",
      image: "/assets/product-grocery.svg",
      category: "commodities",
      badge: "Bulk Commodities",
      order: 1,
    },
    {
      slug: "agro",
      name: "Agro",
      desc: "Strategic guidance delivering smart, sustainable business solutions.",
      image: "/assets/product-agro.svg",
      category: "agro",
      badge: "Agriculture",
      order: 2,
    },
    {
      slug: "hms",
      name: "HMS 1&2",
      desc: "Strategic guidance delivering smart, sustainable business solutions.",
      image: "/assets/product-hms.svg",
      category: "steel",
      badge: "Steel & Metals",
      order: 3,
    },
    {
      slug: "steel",
      name: "Strong Steel",
      desc: "High-quality metals built for durability and strength",
      image: "/assets/product-steel.svg",
      category: "steel",
      badge: "Steel & Metals",
      order: 4,
    },
    {
      slug: "sugar",
      name: "Pure Sugar",
      desc: "Clean sweetness for every kitchen.",
      image: "/assets/product-sugar.svg",
      category: "commodities",
      badge: "Bulk Commodities",
      order: 5,
    },
    {
      slug: "spices",
      name: "Natural Spices",
      desc: "Rich aroma and authentic flavor from farm to table.",
      image: "/assets/product-spices.svg",
      category: "commodities",
      badge: "Bulk Commodities",
      order: 6,
    },
    {
      slug: "fertilizer",
      name: "Quality Fertilizer",
      desc: "Enhance soil health and support strong, sustainable plant growth for better yields and greener results.",
      image: "/assets/product-fertilizer.svg",
      category: "agro",
      badge: "Agriculture",
      order: 7,
    },
  ];

  for (const s of initialServices) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log(`Seeded ${initialServices.length} default services.`);

  // 4. Seed initial sample trade inquiries
  const existingInquiries = await prisma.tradeInquiry.count();
  if (existingInquiries === 0) {
    await prisma.tradeInquiry.createMany({
      data: [
        {
          commodity: "Strong Steel",
          volume: "1,200 Metric Tons",
          name: "Karim Chowdhury",
          email: "k.chowdhury@steelinfra.com",
          phone: "+8801712345678",
          company: "Bengal Infrastructure Ltd",
          message: "Requesting FOB CIF Chittagong rate for deformed steel rebar specification Grade 60.",
          status: InquiryStatus.NEW,
        },
        {
          commodity: "HMS 1&2",
          volume: "2,500 Metric Tons",
          name: "Ahmed Tariq",
          email: "tariq@dhakametals.net",
          phone: "+8801819234567",
          company: "Dhaka Re-rolling Mills",
          message: "Looking for heavy melting scrap bulk shipment with L/C terms.",
          status: InquiryStatus.CONTACTED,
        },
        {
          commodity: "Pure Sugar",
          volume: "500 Metric Tons",
          name: "Sultana Enterprise",
          email: "procurement@sultanafoods.bd",
          phone: "+8801912987654",
          company: "Sultana Agro & Foods",
          message: "Need refined white sugar quotation for monthly delivery.",
          status: InquiryStatus.IN_NEGOTIATION,
        },
      ],
    });
    console.log("Seeded initial trade inquiries.");
  }

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
