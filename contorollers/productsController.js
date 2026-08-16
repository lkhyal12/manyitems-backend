const { logControllerError } = require("../lib/utils");
const ProductModel = require("../models/Product");
const mongoose = require("mongoose");
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

// delete product controller
async function deleteProductController(req, res) {
  const { id: productId } = req.params;
  try {
    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product Not found" });
    await product.deleteOne();

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    logControllerError("deleteProductController", err);
    return res.status(500).json({ message: "Srevr error" });
  }
}

// get products controller
async function getProductsController(req, res) {
  const {
    collection,
    size,
    color,
    gender,
    material,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    brand,
    limit,
  } = req.query;

  try {
    const query = {};
    if (collection && collection.toLowerCase() !== "all") {
      query.collections = collection;
    }
    if (category && category.toLowerCase() !== "all") {
      query.category = category;
    }

    if (material) {
      query.material = { $in: material.split(",") };
    }

    if (brand) {
      query.brand = { $in: brand.split(",") };
    }

    if (size) {
      query.sizes = { $in: size.split(",") };
    }
    if (color) {
      query.colors = { $in: [color] };
    }

    if (gender) {
      query.gender = gender;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc": {
          sort = { price: 1 };
          break;
        }
        case "priceDesc": {
          sort = { price: -1 };
          break;
        }
        case "popularity": {
          sort = { rating: -1 };
          break;
        }
        default:
          break;
      }
    }

    const products = await ProductModel.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);
    return res
      .status(200)
      .json({ message: "Products sent successfully", products });
  } catch (err) {
    logControllerError("getProductsController", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// get single product
async function getSingleProductController(req, res) {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid product ID" });
  try {
    const product = await ProductModel.findById(id).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res
      .status(200)
      .json({ message: "Product sent successfully", product });
  } catch (err) {
    logControllerError("getsingleproduct", err);
    return res.status(500).json({ message: "Srever error" });
  }
}

// get similar products
async function getSimilarProductsController(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid product ID" });

  try {
    const product = await ProductModel.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const similarProducts = await ProductModel.find({
      _id: { $ne: id },
      category: product.category,
      gender: product.gender,
    }).limit(4);

    return res
      .status(200)
      .json({ message: "products sent successfully", similarProducts });
  } catch (err) {
    logControllerError("getsimikarproducts", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// best seller controller
async function bestSellerController(req, res) {
  try {
    const product = await ProductModel.findOne().sort({ rating: -1 });
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res
      .status(200)
      .json({ message: "Product sent successfully", product });
  } catch (err) {
    logControllerError("bestSellerController", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// new arrivals controller
async function newArrivalsController(req, res) {
  try {
    const newArrivals = await ProductModel.find()
      .sort({ createdAt: -1 })
      .limit(8);
    if (!newArrivals)
      return res.status(404).json({ message: "No newArrivals were found" });

    return res
      .status(200)
      .json({ message: "Products sent successfully", products: newArrivals });
  } catch (err) {
    logControllerError("newArrivalsController", err);
    return res.status(500).json({ message: "Server error" });
  }
}
module.exports = {
  createProductController,
  updateProductController,
  deleteProductController,
  getProductsController,
  getSingleProductController,
  getSimilarProductsController,
  bestSellerController,
  newArrivalsController,
};
