import prisma from "../config/db.js";
import catchAsync from "../middlewares/catchAsync.js";

export const addFavourite = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { mangaId } = req.body;

  const fav = await prisma.favourite.create({
    data: { userId, mangaId: Number(mangaId) },
  });

  res.status(201).json(fav);
});

export const removeFavourite = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { mangaId } = req.params;

  await prisma.favourite.delete({
    where: {
      userId_mangaId: {
        userId,
        mangaId: Number(mangaId),
      },
    },
  });

  res.json({ ok: true });
});

export const getMyFavourites = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const favourites = await prisma.favourite.findMany({
    where: { userId },
    include: { manga: true },
  });

  res.json(favourites);
});