const express = require("express");
const router = express.Router();
const { protectedSeller, protectedUser } = require("../middleware/auth");
const {
  addProduct,
  editProductDetails,
  getAllProducts,
  deleteProduct,
  getProductById,
  toggleProductStatus,
  getSellerProducts,
  searchProducts,
  searchByCategory,
} = require("../Controllers/productController");
const createUploader = require("../middleware/upload");

const productUpload = createUploader("product_images");

router.post(
  "/addProduct",
  protectedUser,
  protectedSeller,
  productUpload.single("image"),
  addProduct
);

router.put(
  "/editProductDetails/:productId",
  protectedUser,
  protectedSeller,
  productUpload.single("image"),
  editProductDetails
);

router.get("/getAllProducts", getAllProducts);
router.get("/getProductById/:productId", getProductById);

router.delete(
  "/deleteProduct/:productId",
  protectedUser,
  protectedSeller,
  deleteProduct
);

router.put(
  "/toggleProductStatus/:productId",
  protectedUser,
  protectedSeller,
  toggleProductStatus
);
router.get(
  "/getSellerProducts/:sellerId",
  protectedUser,
  protectedSeller,
  getSellerProducts
);

router.get('/searchByCategory', searchByCategory);

router.post("/searchProducts", searchProducts);

module.exports = router;
