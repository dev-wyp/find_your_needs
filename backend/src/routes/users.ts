import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany({ take: 20 });
  res.json({ items: users });
});

// GET user detail
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        listings: true,
        reviews: true,
      },
    })

    if (!user) return res.status(404).json({ error: 'user not found' })

    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})


export default router;
