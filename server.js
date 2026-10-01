const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const conntectToMongoDB = require("./config/db");
const authRouter = require("./router/authRoutes");
const cookieParse = require("cookie-parser");
const productsRouter = require("./router/productsRouter");
const cartRouter = require("./router/cartRouter");
const checkoutRouter = require("./router/CheckoutRouter");
const { ordersRouter } = require("./router/ordersRouter");
const uploadRouter = require("./router/uploadRouter");
const { subscriberRouter } = require("./router/subscriberRouter");
const { usersRouter } = require("./router/usersRouter");
const { adminProductsRouter } = require("./router/adminProductsRouter");
const { adminOrdersRouter } = require("./router/adminOrdersRouter");
const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParse());
dotenv.config();

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("welcome to my server"));
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/upload", uploadRouter);
app.use("/api", subscriberRouter);
app.use("/api/admin/users", usersRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrdersRouter);
app.listen(PORT, () => {
  conntectToMongoDB();
});
