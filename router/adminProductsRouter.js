const express = require("express");
const { protectedRoute, isAdmin } = require("../middleware/protectedRoute");
const adminProductsRouter = express.Router();
adminProductsRouter.get(
  "/",
  protectedRoute,
  isAdmin,
  getAdminProductsController,
);
module.exports = { adminProductsRouter };
