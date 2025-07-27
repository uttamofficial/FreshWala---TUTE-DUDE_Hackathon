const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout
} = require("../controllers/authController");
const { protectedUser } = require("../middleware/auth");
const createUploader = require("../middleware/upload");
const { updateProfile, profile } = require("../controllers/userController");

// Create the uploader middleware for profile images
const profileUpload = createUploader("user_profiles");

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

router.get("/profile", protectedUser, profile);
router.put("/profile", protectedUser, profileUpload.single("profilePhoto"), updateProfile);

module.exports = router;
