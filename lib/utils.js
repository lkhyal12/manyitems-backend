function logControllerError(controllerName, err) {
  console.log("error occured in " + controllerName + " controller ", err);
}

module.exports = { logControllerError };
