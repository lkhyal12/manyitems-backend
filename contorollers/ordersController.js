const { logControllerError } = require("../lib/utils");
const OrderModel = require("../models/Order");

async function myOrdersController(req, res) {
  try {
    const orders = await OrderModel.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res
      .status(200)
      .json({ message: "Orders sent successfully", orders });
  } catch (err) {
    logControllerError("myOrders", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// get a single order by id
async function getSingleOrderController(req, res) {
  const { id } = req.params;

  try {
    const order = await OrderModel.findById(id).populate("user", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json({ message: "order sent successfully", order });
  } catch (err) {
    logControllerError("getSingleOrder", err);
    return res.status(500).json({ message: "Server error" });
  }
}
module.exports = { myOrdersController, getSingleOrderController };
