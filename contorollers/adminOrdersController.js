const { logControllerError } = require("../lib/utils");
const OrderModel = require("../models/Order");

async function getAllAdminOrdersController(req, res) {
  try {
    const orders = await OrderModel.find({}).populate("user", "name email");
    return res
      .status(200)
      .json({ message: "Orders sent successfully", orders });
  } catch (err) {
    logControllerError("getAllAdminOrders", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// update order Controller
async function updateOrderController(req, res) {
  const { id } = req.params;
  try {
    const order = await OrderModel.findById(id).populate("user", "name");
    if (!order) return res.status(404).json({ message: "Order is not found" });
    order.status = req.body?.status || order.status;
    order.isDelivered =
      req.body?.status === "Delivered" ? true : order.isDelivered;
    order.deliveredAt =
      req.body?.status === "Delivered" ? Date.now() : order.deliveredAt;
    return res
      .status(200)
      .json({ message: "Order updated successfully", order });
  } catch (err) {
    logControllerError("updateOrder", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// delete order
async function deleteOrderController(req, res) {
  const { id } = req.params;

  try {
    const order = await OrderModel.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    await order.deleteOne();
    return res
      .status(200)
      .json({ message: "Order deleted successfully", order });
  } catch (err) {
    logControllerError("deleteOrder", err);
    return res.status(500).json({ message: "Serever error" });
  }
}
module.exports = {
  getAllAdminOrdersController,
  updateOrderController,
  deleteOrderController,
};
