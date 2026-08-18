function logControllerError(controllerName, err) {
  console.log("error occured in " + controllerName + " controller ", err);
}

async function getCart(userId, guestId, Cart) {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
}
module.exports = { logControllerError, getCart };
