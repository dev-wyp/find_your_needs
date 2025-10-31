// GET /api/dashboard
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { isSuperAdmin } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Helper: monthly counts
const getMonthlyCounts = async (model: "listing" | "user", year: number) => {
  const counts: number[] = [];
  for (let month = 0; month < 12; month++) {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59);
    const count = await prisma[model].count({
      where: { createdAt: { gte: start, lte: end } },
    });
    counts.push(count);
  }
  return counts;
};

// Helper: yearly counts
const getYearlyCounts = async (
  model: "listing" | "user",
  lastYears: number
) => {
  const currentYear = new Date().getFullYear();
  const counts: { year: number; count: number }[] = [];
  for (let i = lastYears - 1; i >= 0; i--) {
    const year = currentYear - i;
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59);
    const count = await prisma[model].count({
      where: { createdAt: { gte: start, lte: end } },
    });
    counts.push({ year, count });
  }
  return counts;
};

// --- Single combined endpoint ---
router.get("/", isSuperAdmin, async (req, res) => {
  try {
    const totalUsers = await prisma.user.aggregate({ _count: true });
    const totalListings = await prisma.listing.aggregate({ _count: true });
    const restaurantCount = await prisma.listing.aggregate({
      where: { type: "RESTAURANT" },
      _count: true,
    });
    const hotelCount = await prisma.listing.aggregate({
      where: { type: "HOTEL" },
      _count: true,
    });
    const shopCount = await prisma.listing.aggregate({
      where: { type: "SHOP" },
      _count: true,
    });

    const currentYear = new Date().getFullYear();
    const monthlyListings = await getMonthlyCounts("listing", currentYear);
    const monthlyUsers = await getMonthlyCounts("user", currentYear);
    const last5YearsListings = await getYearlyCounts("listing", 5);
    const last5YearsUsers = await getYearlyCounts("user", 5);

    res.json({
      totals: {
        totalUsers: totalUsers._count._all,
        totalListings: totalListings._count._all,
        restaurantCount: restaurantCount._count._all,
        hotelCount: hotelCount._count._all,
        shopCount: shopCount._count._all,
      },
      monthly: { listings: monthlyListings, users: monthlyUsers },
      yearly: { listings: last5YearsListings, users: last5YearsUsers },
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

export default router;
