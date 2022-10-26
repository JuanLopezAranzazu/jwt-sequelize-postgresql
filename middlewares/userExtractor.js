const jwt = require("jsonwebtoken");
const { config } = require("./../config/config");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.sendStatus(401);
  console.log(token);
  jwt.verify(token, config.secretKey, async (error, user) => {
    if (error) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = { verifyToken };
