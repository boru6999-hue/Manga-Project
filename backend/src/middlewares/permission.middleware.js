import prisma from "../config/db.js";

const requirePermission = (...codes) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          message: "Unauthorized"
        });
      }

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
    } catch (error) {
      console.error("requirePermission error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error"
      });
    }
  };
};

export default requirePermission;