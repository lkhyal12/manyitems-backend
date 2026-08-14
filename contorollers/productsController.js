const { logControllerError } = require("../lib/utils");
const ProductModel = require("../models/Product");

async function createProductController(req, res) {
  const {
    name,
    description,
    price,
    category,
    discountPrice,
    countInStock,
    brand,
    sizes,
    colors,
    material,
    gender,
    images,
    isFeatured,
    isPublished,
    tags,
    dimensions,
    weight,
    sku,
  } = req.body;

  try {
    const product = new ProductModel({
      name,
      description,
      price,
      category,
      discountPrice,
      countInStock,
      brand,
      sizes,
      colors,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id,
    });
    const createdProduct = await product.save();
    return res.status(201).json({
      message: "Product created successfully",
      product: createdProduct,
    });
  } catch (err) {
    logControllerError("create product controller ", err);
    return res.status(500).json({ message: "server error" });
  }
}

// update product controller
async function updateProductController(req, res) {
  const {
    name,
    description,
    price,
    category,
    discountPrice,
    countInStock,
    brand,
    sizes,
    colors,
    material,
    gender,
    images,
    isFeatured,
    isPublished,
    tags,
    dimensions,
    weight,
    sku,
  } = req.body;
  const { id: productId } = req.params;
  try {
    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const updates = {};
    if (name) updates.name = name;
    if (description) updates.description = description;
    if (price !== undefined) updates.price = price;
    if (category !== undefined) updates.category = category;
    if (discountPrice !== undefined) updates.discountPrice = discountPrice;
    if (countInStock !== undefined) updates.countInStock = countInStock;
    if (brand !== undefined) updates.brand = brand;
    if (sizes !== undefined) updates.sizes = sizes;
    if (colors !== undefined) updates.colors = colors;
    if (material !== undefined) updates.material = material;
    if (gender !== undefined) updates.gender = gender;
    if (images !== undefined) updates.images = images;
    if (isFeatured !== undefined) updates.isFeatured = isFeatured;
    if (isPublished !== undefined) updates.isPublished = isPublished;
    if (tags !== undefined) updates.tags = tags;
    if (dimensions !== undefined) updates.dimensions = dimensions;
    if (weight !== undefined) updates.weight = weight;
    if (sku !== undefined) updates.sku = sku;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        $set: updates,
      },
      { returnDocument: "after", runValidators: true },
    );

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    logControllerError("updateproduct", err);
    res.status(500).json({ message: "Server error" });
  }
}
module.exports = { createProductController, updateProductController };
