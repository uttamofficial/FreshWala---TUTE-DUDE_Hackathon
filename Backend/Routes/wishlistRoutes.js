const express = require("express");
const router = express.Router();
const { protectedUser } = require("../middleware/auth");
const {
  toggleWishlist,
  getMyWishlist,
  clearWishlist,
} = require("../Controllers/wishlistController");

router.post("/toggle/:productId", protectedUser, toggleWishlist);
router.get("/view", protectedUser, getMyWishlist);
router.delete("/clear", protectedUser, clearWishlist);

module.exports = router;
