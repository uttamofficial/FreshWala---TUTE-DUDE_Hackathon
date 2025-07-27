const Wishlist = require("../models/Wishlist");

exports.toggleWishlist = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [productId] });
    } else {
      const exists = wishlist.products.some(
        (id) => id.toString() === productId.toString()
      );

      if (exists) {
        wishlist.products = wishlist.products.filter(
          (id) => id.toString() !== productId.toString()
        );
      } else {
        wishlist.products.push(productId);
      }
    }

    await wishlist.save();
    res.status(200).json({
      success: true,
      added: wishlist.products.some(
        (id) => id.toString() === productId.toString()
      ),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyWishlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "products"
    );

    if (!wishlist) {
      return res.status(200).json({ success: true, products: [] });
    }

    res.status(200).json({
      success: true,
      products: wishlist.products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.clearWishlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const wishlist = await Wishlist.findOne({ user: userId });

    if (wishlist) {
      wishlist.products = [];
      await wishlist.save();
    }

    res.status(200).json({ success: true, message: "Wishlist cleared." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
