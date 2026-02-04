// src/controllers/user.controller.js
const prisma = require('../config/db');

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createUser = async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        age: age ? Number(age) : null,
      },
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
};