const express = require("express");
const { protectedRoute } = require("../middleware/protectedRoute");
const {
  createCheckoutSessionController,
  updateCheckoutAsPaidController,
  finalizeCheckoutController,
} = require("../contorollers/checkoutController");
const checkoutRouter = express.Router();

checkoutRouter.post("/", protectedRoute, createCheckoutSessionController);
checkoutRouter.put("/:id/pay", protectedRoute, updateCheckoutAsPaidController);
checkoutRouter.post(
  "/:id/finalize",
  protectedRoute,
  finalizeCheckoutController,
);

module.exports = checkoutRouter;
