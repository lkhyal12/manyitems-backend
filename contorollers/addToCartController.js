const { getCart, logControllerError } = require("../lib/utils");
const { CartModel } = require("../models/Cart");
const ProductModel = require("../models/Product");
const mongoose = require("mongoose");
async function addToCartController(req, res) {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(productId))
    return res.status(400).json({
      message: "Invalid product ID",
    });
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({
      message: "Quantity must be a positive integer",
    });
  }
  try {
    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const cart = await getCart(userId, guestId, CartModel);
    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId.toString() &&
          p.size === size &&
          p.color === color,
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        });

        cart.totalPrice = cart.products.reduce(
          (ac, el) => ac + el.price * el.quantity,
          0,
        );
      }
      await cart.save();
      return res
        .status(200)
        .json({ message: "Product added to cart successffuly", cart });
    } else {
      const newCart = await CartModel.create({
        user: userId || undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            color,
            size,
            quantity,
            name: product.name,
            price: product.price,
            image: product.images[0].url,
          },
        ],
        totalPrice: product.price * quantity,
      });
      return res.status(201).json({
        message: "new Product added to cart successffuly",
        cart: newCart,
      });
    }
  } catch (err) {
    logControllerError("addToCartController", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// update cart controller
async function updateCartController(req, res) {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    const cart = await getCart(userId, guestId, CartModel);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId.toString() &&
        p.size === size &&
        p.color === color,
    );

    if (productIndex > -1) {
      if (quantity) cart.products[productIndex].quantity = quantity;
      else cart.products.splice(productIndex, 1);
      cart.totalPrice = cart.products.reduce(
        (ac, el) => ac + el.price * el.quantity,
        0,
      );
      await cart.save();
      return res
        .status(200)
        .json({ message: "quantity updated successfully", cart });
    } else
      return res.status(404).json({ message: "Product not found in cart" });
  } catch (err) {
    logControllerError("updateCartController", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// delete product controller
async function deleteProductController(req, res) {
  const { productId, color, size, guestId, userId } = req.body;

  try {
    const cart = await getCart(userId, guestId, CartModel);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId.toString() &&
        p.color === color &&
        p.size === size,
    );
    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
      cart.totalPrice = cart.products.reduce(
        (ac, el) => ac + el.price * el.quantity,
        0,
      );
      await cart.save();
      return res
        .status(200)
        .json({ message: "Product deleted successfuly from cart", cart });
    } else
      return res.status(404).json({ message: "Product not found in cart" });
  } catch (err) {
    logControllerError("delete product", err);
    return res.status(500).json({ message: "Server error" });
  }
}
// get user's cart
async function getUserCartController(req, res) {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(userId, guestId, CartModel);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    return res.status(200).json({ message: "Cart sent successfully", cart });
  } catch (err) {
    logControllerError("getUserCartController", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// merge controller
async function mergeController(req, res) {
  const { guestId } = req.body;

  if (!guestId) {
    return res.status(400).json({
      message: "Guest ID is required",
    });
  }
  try {
    const guestCart = await CartModel.findOne({ guestId });
    if (!guestCart)
      return res.status(404).json({ message: "guest cart is not found" });

    console.log("guest cart found", guestCart);

    if (guestCart.products.length === 0)
      return res.status(400).json({ message: "Guest Cart is empty" });

    const userCart = await CartModel.findOne({ user: req.user._id });

    if (!userCart) {
      guestCart.user = req.user._id;
      guestCart.guestId = undefined;
      await guestCart.save();

      return res
        .status(200)
        .json({
          message: "Guest Cart transferred successfully",
          cart: guestCart,
        });
    }

    guestCart.products.forEach((p) => {
      const productIndex = userCart.products.findIndex(
        (item) =>
          item.productId.toString() === p.productId &&
          item.color === p.color &&
          item.size === p.size,
      );

      if (productIndex > -1) {
        userCart.products[productIndex].quantity += p.quantity;
      } else {
        userCart.products.push(p);
      }
    });

    userCart.totalPrice = userCart.products.reduce(
      (ac, el) => ac + el.price * el.quantity,
      0,
    );

    await userCart.save();

    await CartModel.findOneAndDelete({ guestId });

    return res
      .status(200)
      .json({ message: "Guest Cart merged successfully", cart: userCart });
  } catch (err) {
    logControllerError("mergeController", err);
    return res.status(500).json({ message: "Server error" });
  }
}
module.exports = {
  addToCartController,
  updateCartController,
  deleteProductController,
  getUserCartController,
  mergeController,
};
