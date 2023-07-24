import express from "express";
import {
  login,
  logout,
  loggedInUser,
  registerInProcess,
  verifyRegisterUser,
  forgetPassword,
  resetPassword,
  updatePassword
} from "../controllers/authController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

// create route
router.post("/login", login);
router.post("/logout", logout);
// router.post("/register", register)
router.post("/process-register", registerInProcess);
router.post("/verify-user", verifyRegisterUser);
router.post("/forget-password", forgetPassword);
router.put("/reset-password", resetPassword);
router.put("/update-password", verifyToken, updatePassword);
router.get("/me", verifyToken, loggedInUser);

// export default router
export default router;
