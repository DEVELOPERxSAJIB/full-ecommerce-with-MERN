import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js";

// verify token
const verifyToken = (req, res, next) => {
  try {
    // const authHeader = req.headers.authorization || req.headers.Authorization;

    const { accessToken } = req.cookies

    if (!accessToken) {
      return res.status(400).json({ message: "unauthoraized" });
    }

    jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET,
      expressAsyncHandler(async (err, decode) => {
        if (err) {
          return res.status(400).json({ message: "Invalid Token" });
        }

        const me = await User.findOne({ email: decode.email }).select(
          "-password"
        );
        
        req.me = me;

        next();
      })
    );

  } catch (error) {
    next(error);
  }
};

export default verifyToken;
