import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from "../controllers/userController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.route("/").get(protect, admin, getUsers).post(registerUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);
router.post("/logout", logoutUser);
router.post("/auth", authUser);

export default router;
