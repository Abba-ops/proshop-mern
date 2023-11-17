import {
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
  createProductReview,
} from "../controllers/productController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.route("").get(getProducts).post(protect, admin, createProduct);
router.get("/top", getTopProducts);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);
router.route("/:id/reviews").post(protect, createProductReview);

export default router;
