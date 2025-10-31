import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // --- 1. Create Users ---
  const usersData = [
    {
      name: "Alice",
      email: "alice@example.com",
      password: "password",
      role: "user",
    },
    {
      name: "Bob",
      email: "bob@example.com",
      password: "password",
      role: "user",
    },
    {
      name: "Charlie",
      email: "charlie@example.com",
      password: "password",
      role: "user",
    },
    {
      name: "Admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    },
    {
      name: "Super Admin",
      email: "superadmin@example.com",
      password: "superadmin123",
      role: "superAdmin",
    },
  ];

  for (const u of usersData) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { name: u.name, email: u.email, password: hashedPassword, role: u.role },
    });
  }
  const allUsers = await prisma.user.findMany();

  // --- 2. Create Categories ---
  const categoriesData = [
    "Café",
    "Luxury Hotel",
    "Budget Hotel",
    "Clothing",
    "Electronics",
    "Bakery",
  ];
  const categories = await Promise.all(
    categoriesData.map((name) =>
      prisma.listingCategory.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  // --- 3. Create Listings (50) ---
  const listingTypes = ["RESTAURANT", "HOTEL", "SHOP"] as const;

  const cities = ["Yangon", "Mandalay", "Naypyidaw"];

  for (let i = 1; i <= 50; i++) {
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    const randomType = listingTypes[Math.floor(Math.random() * listingTypes.length)];
    const randomCategories = categories
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);

    await prisma.listing.create({
      data: {
        title: `${randomType} Listing ${i}`,
        description: `This is a sample description for listing ${i}. Lorem ipsum dolor sit amet.`,
        type: randomType,
        address: `${i * 10} Sample Street`,
        city: cities[i % cities.length],
        country: "Myanmar",
        phone: `09${Math.floor(100000000 + Math.random() * 899999999)}`,
        website: `https://listing${i}.example.com`,
        rating: parseFloat((Math.random() * 5).toFixed(1)),
        images: [
          `https://dummyjson.com/image/400x200/008080/ffffff?text=${randomType}!&fontSize=16',${i}`,
          `https://dummyjson.com/image/400x200/008080/ffffff?text=${cities[i % cities.length]}!&fontSize=14',${i}`,
        ],
        userId: randomUser.id,
        categories: { connect: randomCategories.map((c) => ({ id: c.id })) },
      },
    });
  }

  const allListings = await prisma.listing.findMany();

  // --- 4. Add Reviews ---
  await prisma.review.createMany({
    data: [
      {
        rating: 5,
        comment: "Amazing place!",
        userId: allUsers[0].id,
        listingId: allListings[0].id,
      },
      {
        rating: 4,
        comment: "Very comfortable.",
        userId: allUsers[1].id,
        listingId: allListings[1].id,
      },
      {
        rating: 3,
        comment: "Good, but a bit expensive.",
        userId: allUsers[2].id,
        listingId: allListings[1].id,
      },
      {
        rating: 5,
        comment: "Best bakery in town!",
        userId: allUsers[0].id,
        listingId: allListings[4].id,
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
