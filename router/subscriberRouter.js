const express = require("express");
const { SubscriberModel } = require("../models/Subscriber");
const { logControllerError } = require("../lib/utils");
const subscriberRouter = express.Router();

subscriberRouter.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    let subscriber = await SubscriberModel.findOne({ email });
    if (subscriber)
      return res.status(400).json({ message: "This email already subscribed" });

    subscriber = new SubscriberModel({ email });
    await subscriber.save();
    return res
      .status(201)
      .json({ message: "Successfully subscribed to the newsletter!" });
  } catch (err) {
    logControllerError("Subscriber", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = { subscriberRouter };
