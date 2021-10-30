const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(
      token,
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpYXQiOjE0ODA5MjkyODIsImV4cCI6MTQ4MDkzMjg2OCwibmFtZSI6IlVzZXJuYW1lIn0gZeuWNbjO8kyEX92AjgX5oLy5qhu6YWTPr6vtYELZQ4"
    );
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
