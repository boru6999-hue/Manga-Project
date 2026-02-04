import prisma from "../config/db.js";

// POST /api/favourites
export const addFavourite = async (req, res) => {
  try {
    const { userId, mangaId } = req.body;

    const uid = Number(userId);
    const mid = Number(mangaId);

    if (!Number.isFinite(uid) || !Number.isFinite(mid)) {
      return res.status(400).json({ message: "userId and mangaId required" });
    }

    const fav = await prisma.favourite.create({
      data: { userId: uid, mangaId: mid },
    });

    res.status(201).json(fav);
  } catch (err) {
    // already favourited
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Already in favourites" });
    }
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/favourites
export const removeFavourite = async (req, res) => {
  try {
    const { userId, mangaId } = req.body;

    const uid = Number(userId);
    const mid = Number(mangaId);

    if (!Number.isFinite(uid) || !Number.isFinite(mid)) {
      return res.status(400).json({ message: "userId and mangaId required" });
    }

    await prisma.favourite.delete({
      where: {
        userId_mangaId: {
          userId: uid,
          mangaId: mid,
        },
      },
    });

    res.json({ ok: true });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Favourite not found" });
    }
    res.status(500).json({ message: err.message });
  }
};

// GET /api/favourites/:userId
export const getUserFavourites = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!Number.isFinite(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const favourites = await prisma.favourite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        manga: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            createdAt: true,
          },
        },
      },
    });

    res.json(favourites.map((f) => f.manga));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
