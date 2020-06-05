const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if(!authHeader) {
    return res
    .status(401)
    .json({ message: "Unauthorised, you must login to continue" });
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    // check if session exists
    if(!req.session.isLoggedIn) {
      return res
      .status(401)
      .json({ message: "Unauthorised, you must login to continue" });
    }
    decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return res.status(500).json({ message: "Token Doesn't match, Try again" });
  }
  if (!decodedToken || !authHeader) {
    return res
      .status(401)
      .json({ message: "Unauthorised, login to continue" });
  }
  req.id = decodedToken.id;
  req.email = decodedToken.email;
  next();
};
