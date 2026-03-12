import prisma from "../config/db.js";

const requirePermission = (...codes) => {
  return async (req, res, next) => {
    const userId = req.user.id;

    const match = await prisma.userpermission.findFirst({
      where: {
        userId,
        permission: {
          code: { in: codes }
        }
      }
    });

    if (!match) {
      return res.status(403).json({
        message: "Permission denied"
      });
    }

    next();
  };
};

export default requirePermission;