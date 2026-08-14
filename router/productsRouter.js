const express = require("express");
const { protectedRoute, isAdmin } = require("../middleware/protectedRoute");
const {
  createProductController,
  updateProductController,
} = require("../contorollers/productsController");
const productsRouter = express.Router();

productsRouter.post("/", protectedRoute, createProductController);
productsRouter.put("/:id", protectedRoute, updateProductController);
module.exports = productsRouter;
