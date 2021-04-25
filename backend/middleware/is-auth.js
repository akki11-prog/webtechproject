const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { headers } = req;
  const authorization = headers['authorization'];

  let token = authorization.split(" ")[1];
  if (!token) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  req.userType = decodedToken.type;
  next();
};
