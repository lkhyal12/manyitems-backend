const { logControllerError } = require("../lib/utils");
const CheckoutModel = require("../models/Checkout");
const OrderModel = require("../models/Order");
const { CartModel } = require("../models/Cart");
async function createCheckoutSessionController(req, res) {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;
  console.log(req.user);
  if (!checkoutItems || !checkoutItems.length === 0)
    return res.status(400).json({ message: "no items in checkout" });

  try {
    const newCheckout = await CheckoutModel.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });
    console.log("checkout session created ", req.user._id);
    res
      .status(201)
      .json({ message: "Checkout session created successfully", newCheckout });
  } catch (err) {
    logControllerError("checkoutSession", err);
    return res.status(500).json({ message: "Server error" });
  }
}
async function updateCheckoutAsPaidController(req, res) {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await CheckoutModel.findById(req.params.id);
    if (!checkout)
      return res.status(404).json({ message: "Checkout session not found" });

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      chkoutpaidAt = Date.now();
      await checkout.save();
      return res.status(200).json(checkout);
    } else {
      return res.status(400).json({ message: "Invalid payment status" });
    }
  } catch (err) {
    logControllerError("updatechekoutaspaid", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// finalize checkout
async function finalizeCheckoutController(req, res) {
  try {
    const checkout = await CheckoutModel.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout session not found" });
    }

    if (checkout.isPaid && !checkout.isFinalized) {
      const finalOrder = await OrderModel.create({
        user: checkout.user,
        orderItems: checkout.orderItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "paid",
        paymentDetails: checkout.paymentDetails,
      });

      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();
      await CartModel.findOneAndDelete({ user: req.user._id });
      return res
        .status(201)
        .json({ message: "Order created successfully", order: finalOrder });
    } else if (checkout.isFinalized) {
      return res.status(400).json({ message: "checkout is already finalized" });
    } else {
      return res.status(400).json({ message: "Checkout is not paid" });
    }
  } catch (err) {
    logControllerError("finalizecheckoutcontroller", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createCheckoutSessionController,
  updateCheckoutAsPaidController,
  finalizeCheckoutController,
};
