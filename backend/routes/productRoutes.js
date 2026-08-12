import express from 'express';
import multer from 'multer';
import path from 'path';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).populate('category', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create product (Admin only)
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    let imagePaths = [];
    
    if (req.files) {
      imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    }

    // In case no images uploaded but urls passed
    if (req.body.existingImages) {
        let existing = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
        imagePaths = [...imagePaths, ...existing];
    }

    const product = new Product({
      title,
      description,
      price,
      category,
      images: imagePaths,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update product (Admin only)
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.title = title || product.title;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;

      let imagePaths = [];
      if (req.files && req.files.length > 0) {
        imagePaths = req.files.map(file => `/uploads/${file.filename}`);
      }

      if (req.body.existingImages) {
        let existing = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
        imagePaths = [...imagePaths, ...existing];
      }

      if (imagePaths.length > 0) {
        product.images = imagePaths;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Delete product (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
