import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

// ✅ Admin-only middleware
const adminOnly = async (req: AuthRequest, res: any, next: any) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};

// GET all listings
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { type, city, country, search, page = "1", limit = "10" } = req.query;

    const filters: any = {};

    if (type) filters.type = type;
    if (city) filters.city = { contains: city as string, mode: "insensitive" };
    if (country) filters.country = { contains: country as string, mode: "insensitive" };
    if (search) {
      filters.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const [total, items] = await Promise.all([
      prisma.listing.count({ where: filters }),
      prisma.listing.findMany({
        where: filters,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        include: { user: true, categories: true },
      }),
    ]);

    res.json({
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      items,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

// GET listing detail
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        user: true,           // owner info
        categories: true,     // category list
        reviews: {            // reviews with user
          include: { user: true },
        },
      },
    })

    if (!listing) return res.status(404).json({ error: 'Listing not found' })

    res.json(listing)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// --- POST new listing (admin only) ---
router.post("/", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
  const { title, description, type, address, city, country, phone, website } =
    req.body;

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      type,
      address,
      city,
      country,
      phone,
      website,
      userId: req.userId!,
    },
  });

  res.json(listing);
});

// ✅ UPDATE listing (Admin only)
router.put("/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updated = await prisma.listing.update({
      where: { id },
      data,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Failed to update listing" });
  }
});

// ✅ DELETE listing (Admin only)
router.delete("/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
  const { id } = req.params;

  try {
    await prisma.listing.delete({ where: { id } });
    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete listing" });
  }
});

export default router;
