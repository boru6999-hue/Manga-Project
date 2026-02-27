import prisma from "../config/db.js";

// GET /api/manga
export const getMangaList = async (req, res) => {
  try {
    const { categoryId, q } = req.query;

    const where = {};

    if (categoryId) {
      const cid = Number(categoryId);
      if (!Number.isFinite(cid)) {
        return res.status(400).json({ message: "Invalid categoryId" });
      }
      where.categoryId = cid;
    }

    if (q && typeof q === "string" && q.trim()) {
      where.title = { contains: q.trim() };
    }

    const manga = await prisma.manga.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true } },
        tags: { include: { tag: { select: { id: true, name: true } } } },
        _count: {
          select: { comments: true, likes: true, watchlist: true, favourites: true },
        },
      },
    });

    // tags-ийг "Tag[]" болгож цэвэрлээд буцаая
    const shaped = manga.map((m) => ({
      ...m,
      tags: m.tags.map((t) => t.tag),
    }));

    res.json(shaped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/manga/:id
export const getMangaById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid manga id" });
    }

    const manga = await prisma.manga.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        tags: { include: { tag: { select: { id: true, name: true } } } },
        _count: { select: { comments: true, likes: true } },
      },
    });

    if (!manga) return res.status(404).json({ message: "Manga not found" });

    res.json({
      ...manga,
      tags: manga.tags.map((t) => t.tag),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/manga
export const createManga = async (req, res) => {
  try {
    const { title, description, coverImage, categoryId, tagIds } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ message: "title is required" });
    }

    const cid = Number(categoryId);
    if (!Number.isFinite(cid)) {
      return res.status(400).json({ message: "categoryId is required" });
    }

    // 1) Manga үүсгэнэ
    const manga = await prisma.manga.create({
      data: {
        title: title.trim(),
        description: description?.trim?.() ?? description,
        coverImage: coverImage?.trim?.() ?? coverImage,
        categoryId: cid,
      },
    });

    // 2) Tag холбоно (өгсөн бол)
    if (Array.isArray(tagIds) && tagIds.length > 0) {
      const ids = tagIds
        .map((x) => Number(x))
        .filter((x) => Number.isFinite(x));

      // join table insert (давхардал орж ирвэл алдаа гаргахгүй)
      await prisma.mangaTag.createMany({
        data: ids.map((tid) => ({ mangaId: manga.id, tagId: tid })),
        skipDuplicates: true,
      });
    }

    // 3) Буцааж “expanded” data өгье
    const created = await prisma.manga.findUnique({
      where: { id: manga.id },
      include: {
        category: { select: { id: true, name: true } },
        tags: { include: { tag: { select: { id: true, name: true } } } },
      },
    });

    res.status(201).json({
      ...created,
      tags: created.tags.map((t) => t.tag),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/manga/:id
export const updateManga = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid manga id" });
    }

    const { title, description, coverImage, categoryId, tagIds } = req.body;

    const data = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ message: "title must be a non-empty string" });
      }
      data.title = title.trim();
    }

    if (description !== undefined) data.description = description;
    if (coverImage !== undefined) data.coverImage = coverImage;

    if (categoryId !== undefined) {
      const cid = Number(categoryId);
      if (!Number.isFinite(cid)) {
        return res.status(400).json({ message: "Invalid categoryId" });
      }
      data.categoryId = cid;
    }

    // 1) Manga update
    await prisma.manga.update({
      where: { id },
      data,
    });

    // 2) Tag update (өгсөн бол: хуучныг цэвэрлээд шинээр холбоно)
    if (Array.isArray(tagIds)) {
      const ids = tagIds
        .map((x) => Number(x))
        .filter((x) => Number.isFinite(x));

      await prisma.mangaTag.deleteMany({ where: { mangaId: id } });

      if (ids.length > 0) {
        await prisma.mangaTag.createMany({
          data: ids.map((tid) => ({ mangaId: id, tagId: tid })),
          skipDuplicates: true,
        });
      }
    }

    const updated = await prisma.manga.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        tags: { include: { tag: { select: { id: true, name: true } } } },
        _count: { select: { comments: true, likes: true } },
      },
    });

    res.json({
      ...updated,
      tags: updated.tags.map((t) => t.tag),
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Manga not found" });
    }
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/manga/:id
export const deleteManga = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid manga id" });
    }

    await prisma.manga.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Manga not found" });
    }
    res.status(500).json({ message: err.message });
  }
};
