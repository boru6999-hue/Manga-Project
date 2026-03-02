import prisma from "../config/db.js";

// GET /api/tags
export const getTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { manga: true } }, // Tag дээр manga count (Tag -> MangaTag relation)
      },
    });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/tags/:id
export const getTagById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid tag id" });
    }

    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        manga: {
          // энэ нь MangaTag list ирнэ
          include: {
            manga: {
              select: { id: true, title: true, coverImage: true, createdAt: true },
            },
          },
        },
        _count: { select: { manga: true } },
      },
    });

    if (!tag) return res.status(404).json({ message: "Tag not found" });
    res.json(tag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tags
export const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "name is required" });
    }

    const tag = await prisma.tag.create({
      data: { name: name.trim() },
    });

    res.status(201).json(tag);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Tag name already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/tags/:id
export const updateTag = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;

    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid tag id" });
    }
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "name is required" });
    }

    const updated = await prisma.tag.update({
      where: { id },
      data: { name: name.trim() },
    });

    res.json(updated);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Tag not found" });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Tag name already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/tags/:id
export const deleteTag = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid tag id" });
    }

    // Tag дээр manga байвал (MangaTag холбоо байвал) устгахгүй
    const linkCount = await prisma.mangaTag.count({ where: { tagId: id } });
    if (linkCount > 0) {
      return res.status(409).json({
        message: "Cannot delete tag that is used by manga. Remove links first.",
      });
    }

    await prisma.tag.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(500).json({ message: err.message });
  }
};
