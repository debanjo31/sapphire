export function checkAuthorization(req, res, next) {
  console.log("Checking authorization...", req.headers);
  if (req.headers.authorization) {
    next();
  } else {
    res.status(403).json({
      message: "You are not authorized to access this resource.",
    });
  }
}
