import express from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  getSingleUser,
  updateUser,
} from "../controllers/userController.js";
import verifyToken from "../middlewares/verifyToken.js";
import profilePhotoMulter from "../middlewares/multer.js";

const router = express.Router();
router.use(verifyToken);
// create route
router.route("/").get(getAllUser).post(createUser);
router.route("/:id").get(getSingleUser).delete(deleteUser);
router.put("/update-user", verifyToken, profilePhotoMulter, updateUser);

// export default router
export default router;
