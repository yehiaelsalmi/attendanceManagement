const jwt = require("jsonwebtoken");
const userModel = require("../DB/models/user.model");

const auth = (data) => {
  return async (req, res, next) => {
    let headerToken = req.headers.authorization;
    if (!headerToken || !headerToken.startsWith("Bearer")) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    } else {
      let token = headerToken.split(" ")[1];
      let { id } = jwt.verify(token, process.env.JWTKEY);
      let user = await userModel.findById(id);
      if (user) {
        req.user = user;
        if (data.includes(user.role)) {
          next();
        } else {
          res.status(500).json({
            success: false,
            message: "Not allowed",
          });
        }
      } else {
        res.status(500).json({
          success: false,
          message: "Invalid ID",
        });
      }
    }
  };
};

module.exports = auth;
