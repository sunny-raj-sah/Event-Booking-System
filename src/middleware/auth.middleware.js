const { users } = require("../data/store");

const authMiddleware = (req, res, next) => {
  const userId = Number(req.headers["user-id"]);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = user;
  next();
};

module.exports = authMiddleware;
