import prisma from "../config/db.js";

// GET /api/manga
export const getMangaList = async (req, res) => {
  try {
    const { categoryId, q } = req.query;

    const where = {};
    if (categoryId) {
      const cid = Number(categoryId);
      if (!Number.isFinite(cid)) return res.status(400).json({ message: "Invalid categoryId" });
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
        mangatag: { include: { tag: { select: { id: true, name: true } } } },
        _count: { select: { comment: true, like: true, watchlist: true, favourite: true } },
      },
    });

    const shaped = manga.map((m) => ({
      ...m,
      tags: m.mangatag.map((mt) => mt.tag),
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
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid manga id" });

    const manga = await prisma.manga.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        mangatag: { include: { tag: { select: { id: true, name: true } } } },
        _count: { select: { comment: true, like: true } },
      },
    });

    if (!manga) return res.status(404).json({ message: "Manga not found" });

    res.json({ ...manga, tags: manga.mangatag.map((mt) => mt.tag) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/manga
export const createManga = async (req, res) => {
  try {
    const { title, description, coverImage, categoryId, tagIds } = req.body;

    if (!title || typeof title !== "string") return res.status(400).json({ message: "title is required" });
    const cid = Number(categoryId);
    if (!Number.isFinite(cid)) return res.status(400).json({ message: "categoryId is required" });

    // 1) Manga үүсгэх
    const manga = await prisma.manga.create({
      data: {
        title: title.trim(),
        description: description?.trim?.() ?? description,
        coverImage: coverImage?.trim?.() ?? coverImage,
        categoryId: cid,
      },
    });

    // 2) Tags холбох
    if (Array.isArray(tagIds) && tagIds.length > 0) {
      const ids = tagIds.map(Number).filter(Number.isFinite);
      if (ids.length > 0) {
        await prisma.mangatag.createMany({
          data: ids.map((tid) => ({ mangaId: manga.id, tagId: tid })),
          skipDuplicates: true,
        });
      }
    }

    // 3) Буцааж include хийсэн data
    const created = await prisma.manga.findUnique({
      where: { id: manga.id },
      include: {
        category: { select: { id: true, name: true } },
        mangatag: { include: { tag: { select: { id: true, name: true } } } },
      },
    });

    res.status(201).json({ ...created, tags: created.mangatag.map((mt) => mt.tag) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/manga/:id
export const updateManga = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid manga id" });

    const { title, description, coverImage, categoryId, tagIds } = req.body;
    const data = {};
    if (title !== undefined) { if (!title.trim()) return res.status(400).json({ message: "title must be non-empty" }); data.title = title.trim(); }
    if (description !== undefined) data.description = description;
    if (coverImage !== undefined) data.coverImage = coverImage;
    if (categoryId !== undefined) { const cid = Number(categoryId); if (!Number.isFinite(cid)) return res.status(400).json({ message: "Invalid categoryId" }); data.categoryId = cid; }

    await prisma.manga.update({ where: { id }, data });

    if (Array.isArray(tagIds)) {
      const ids = tagIds.map(Number).filter(Number.isFinite);
      // хуучин холбоос устгах
      await prisma.mangatag.deleteMany({ where: { mangaId: id } });
      if (ids.length > 0) {
        await prisma.mangatag.createMany({
          data: ids.map((tid) => ({ mangaId: id, tagId: tid })),
          skipDuplicates: true,
        });
      }
    }

    const updated = await prisma.manga.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        mangatag: { include: { tag: { select: { id: true, name: true } } } },
        _count: { select: { comment: true, like: true } },
      },
    });

    res.json({ ...updated, tags: updated.mangatag.map((mt) => mt.tag) });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Manga not found" });
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/manga/:id
export const deleteManga = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid manga id" });

    await prisma.manga.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Manga not found" });
    res.status(500).json({ message: err.message });
  }
};