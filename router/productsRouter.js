const express = require("express");
const { protectedRoute, isAdmin } = require("../middleware/protectedRoute");
const {
  createProductController,
  updateProductController,
  deleteProductController,
  getProductsController,
  getSingleProductController,
  getSimilarProductsController,
  bestSellerController,
  newArrivalsController,
} = require("../contorollers/productsController");
const productsRouter = express.Router();

productsRouter.post("/", protectedRoute, isAdmin, createProductController);
productsRouter.put("/:id", protectedRoute, isAdmin, updateProductController);
productsRouter.delete("/:id", protectedRoute, isAdmin, deleteProductController);
productsRouter.get("/", getProductsController);
productsRouter.get("/best-seller", bestSellerController);
productsRouter.get("/new-arrivals", newArrivalsController);
productsRouter.get("/:id", getSingleProductController);
productsRouter.get("/similar/:id", getSimilarProductsController);
module.exports = productsRouter;
