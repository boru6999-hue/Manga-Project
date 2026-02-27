import prisma from "../config/db.js";

// GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { manga: true } } }, // manga count
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/categories/:id
export const getCategoryById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        manga: {
          orderBy: { createdAt: "desc" },
          select: { id: true, title: true, coverImage: true, createdAt: true },
        },
        _count: { select: { manga: true } },
      },
    });

    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "name is required" });
    }

    const category = await prisma.category.create({
      data: { name: name.trim() },
    });

    res.status(201).json(category);
  } catch (err) {
    // Prisma unique error
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Category name already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;

    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid category id" });
    }
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "name is required" });
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { name: name.trim() },
    });

    res.json(updated);
  } catch (err) {
    // record not found
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Category not found" });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Category name already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    // category дээр manga байвал устгахгүй (safe rule)
    const mangaCount = await prisma.manga.count({ where: { categoryId: id } });
    if (mangaCount > 0) {
      return res.status(409).json({
        message: "Cannot delete category with manga. Move manga first.",
      });
    }

    await prisma.category.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(500).json({ message: err.message });
  }
};
