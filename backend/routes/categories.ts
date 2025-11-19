import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  const categories = await prisma.listingCategory.findMany();
  res.json({ items: categories });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.listingCategory.findUnique({
      where: { id },
    });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json({ item: category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
