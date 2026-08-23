const { logControllerError } = require("../lib/utils");
const { ProductModel } = require("../models/Product");
async function getAdminProductsController(req, res) {
  try {
    const products = await ProductModel.find({});
    return res
      .status(200)
      .json({ message: "Products sent successfully", products });
  } catch (err) {
    logControllerError("getAdminProducts", err);
    return res.status(500).json({ message: "Server error" });
  }
}
module.exports = { getAdminProductsController };
