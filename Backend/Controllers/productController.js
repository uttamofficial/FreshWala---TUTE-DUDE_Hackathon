const Product = require("../models/Product");

exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      pricePerUnit,
      unit,
      quantityAvailable,
      discount,
      isActive,
    } = req.body;
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    if (
      name === undefined || name === "" ||
      description === undefined || description === "" ||
      category === undefined || category === "" ||
      pricePerUnit === undefined ||
      unit === undefined || unit === "" ||
      quantityAvailable === undefined ||
      discount === undefined ||
      isActive === undefined
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const supplierId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required." });
    }

    const imageUrl = req.file.path;

    const newProduct = new Product({
      name,
      description,
      category,
      pricePerUnit,
      unit,
      quantityAvailable,
      imageUrl,
      discount,
      supplier: supplierId,
      isActive,
    });

    await newProduct.save();

    return res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error while adding product",
      error: err.message,
    });
  }
};

exports.editProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      name,
      description,
      category,
      pricePerUnit,
      unit,
      quantityAvailable,
      discount,
      isActive,
    } = req.body;

    if (
      !name &&
      !description &&
      !category &&
      !pricePerUnit &&
      !unit &&
      !quantityAvailable &&
      !discount &&
      isActive === undefined &&
      !req.file
    ) {
      return res.status(400).json({ message: "No changes to update." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (product.supplier.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to edit this product.",
      });
    }

    let imageUrl = product.imageUrl;

    if (req.file) {
      imageUrl = req.file.path;
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (pricePerUnit) product.pricePerUnit = pricePerUnit;
    if (unit) product.unit = unit;
    if (quantityAvailable) product.quantityAvailable = quantityAvailable;
    if (discount) product.discount = discount;
    if (isActive !== undefined) product.isActive = isActive;

    product.imageUrl = imageUrl;

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully.",
      product,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error while updating product",
      error: err.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category = "" } = req.query;

    const filter = {};
    if (category) filter.category = { $regex: category, $options: "i" };

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalProducts = await Product.countDocuments(filter);

    return res.status(200).json({
      success: true,
      products,
      pagination: {
        totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        perPage: limit,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error while fetching products",
      error: err.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    // console.log("productId:", productId);
    
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json({ success: true, product });
  } catch (err) {
    return res.status(500).json({
      message: "Error while fetching product",
      error: err.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (
      product.supplier.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You are not authorized to delete this product.",
      });
    }

    await product.remove();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error while deleting product",
      error: err.message,
    });
  }
};

exports.toggleProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (
      product.supplier.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You are not authorized to update this product.",
      });
    }

    product.isActive = !product.isActive;
    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product is now ${product.isActive ? "active" : "inactive"}.`,
      product,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error while updating product status",
      error: err.message,
    });
  }
};

exports.getSellerProducts = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    const limitValue = parseInt(limit, 10);

    const products = await Product.find({ supplier: sellerId, isActive: true })
      .skip(skip)
      .limit(limitValue);

    if (products.length === 0) {
      return res.status(404).json({
        message: "No active products found for this seller.",
      });
    }

    const totalProducts = await Product.countDocuments({
      supplier: sellerId,
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      products,
      pagination: {
        totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        perPage: limit,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error while fetching seller's products.",
      error: err.message,
    });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (keyword) filter.name = { $regex: keyword, $options: "i" };

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalProducts = await Product.countDocuments(filter);

    return res.status(200).json({
      success: true,
      products,
      pagination: {
        totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        perPage: limit,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error while searching for products",
      error: err.message,
    });
  }
};

// GET /api/products/search?category=fruits
exports.searchByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const products = await Product.find({
      category: category,
      isActive: true,
    });

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (err) {
    console.error("Error fetching products by category:", err);
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
};
