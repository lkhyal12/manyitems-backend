const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const conntectToMongoDB = require("./config/db");
const authRouter = require("./router/authRoutes");
const cookieParse = require("cookie-parser");
const productsRouter = require("./router/productsRouter");
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParse());
dotenv.config();

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("welcome to my server"));
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.listen(PORT, () => {
  conntectToMongoDB();
});
