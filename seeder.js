const mongoose = require("mongoose");
const dotenv = require("dotenv");
const conntectToMongoDB = require("./config/db");
const ProductModel = require("./models/Product");
const UserModel = require("./models/User");
const products = require("./data/products");
const { logControllerError } = require("./lib/utils");
const { CartModel } = require("./models/Cart");

dotenv.config();

// contect to mongodb
conntectToMongoDB();

async function seedData() {
  try {
    await ProductModel.deleteMany();
    await UserModel.deleteMany();
    await CartModel.deleteMany();
    const createdUser = await UserModel.create({
      name: "abdelali",
      email: "abtech11@mail.com",
      password: "123456",
      role: "admin",
    });
    const sampleProducts = products.map((product) => ({
      ...product,
      user: createdUser._id,
    }));

    await ProductModel.insertMany(sampleProducts);
    console.log("products data seeded successfully");
    process.exit();
  } catch (err) {
    logControllerError("seed data0", err);
    process.exit(1);
  }
}

seedData();
