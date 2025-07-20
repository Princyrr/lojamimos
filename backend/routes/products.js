import express from 'express';
import { body, query, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import { auth, adminAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Get all products with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Página deve ser um número positivo'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve ser entre 1 e 100'),
  query('category').optional().isIn(['bebe', 'menino', 'menina', 'unissex']).withMessage('Categoria inválida'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Preço mínimo inválido'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Preço máximo inválido'),
  query('sort').optional().isIn(['name', 'price', 'createdAt', 'rating']).withMessage('Ordenação inválida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Parâmetros inválidos',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      category,
      subcategory,
      minPrice,
      maxPrice,
      search,
      sort = 'createdAt',
      order = 'desc',
      inStock = true,
      featured
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (featured === 'true') filter.isFeatured = true;
    if (inStock === 'true') {
      filter['sizes.stock'] = { $gt: 0 };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Search filter
    if (search) {
      filter.$text = { $search: search };
    }

    // Sort options
    const sortOptions = {};
    const sortOrder = order === 'desc' ? -1 : 1;
    
    switch (sort) {
      case 'price':
        sortOptions.price = sortOrder;
        break;
      case 'name':
        sortOptions.name = sortOrder;
        break;
      case 'rating':
        sortOptions['ratings.average'] = sortOrder;
        break;
      default:
        sortOptions.createdAt = sortOrder;
    }

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'name'),
      Product.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage,
          hasPrevPage
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      isActive: true 
    }).populate('createdBy', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Get product error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID do produto inválido'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const products = await Product.getFeatured(limit);

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    if (!['bebe', 'menino', 'menina', 'unissex'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Categoria inválida'
      });
    }

    const products = await Product.getByCategory(category, limit);

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Create product (Admin only)
router.post('/', auth, adminAuth, upload.array('images', 10), [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Nome deve ter entre 2 e 200 caracteres'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Descrição deve ter entre 10 e 2000 caracteres'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Preço deve ser maior que zero'),
  body('category')
    .isIn(['bebe', 'menino', 'menina', 'unissex'])
    .withMessage('Categoria inválida'),
  body('sizes')
    .isArray({ min: 1 })
    .withMessage('Pelo menos um tamanho deve ser especificado'),
  body('colors')
    .isArray({ min: 1 })
    .withMessage('Pelo menos uma cor deve ser especificada')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const productData = {
      ...req.body,
      createdBy: req.user.userId
    };

    // Process uploaded images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        alt: `${productData.name} - Imagem ${index + 1}`,
        isPrimary: index === 0,
        order: index
      }));
    }

    // Parse JSON fields if they're strings
    if (typeof productData.sizes === 'string') {
      productData.sizes = JSON.parse(productData.sizes);
    }
    if (typeof productData.colors === 'string') {
      productData.colors = JSON.parse(productData.colors);
    }
    if (typeof productData.features === 'string') {
      productData.features = JSON.parse(productData.features);
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Update product (Admin only)
router.put('/:id', auth, adminAuth, upload.array('images', 10), [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Nome deve ter entre 2 e 200 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Descrição deve ter entre 10 e 2000 caracteres'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Preço deve ser maior que zero'),
  body('category')
    .optional()
    .isIn(['bebe', 'menino', 'menina', 'unissex'])
    .withMessage('Categoria inválida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        if (typeof req.body[key] === 'string' && 
            ['sizes', 'colors', 'features'].includes(key)) {
          product[key] = JSON.parse(req.body[key]);
        } else {
          product[key] = req.body[key];
        }
      }
    });

    // Process new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        alt: `${product.name} - Imagem ${index + 1}`,
        isPrimary: product.images.length === 0 && index === 0,
        order: product.images.length + index
      }));
      product.images.push(...newImages);
    }

    await product.save();

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: { product }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Delete product (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Soft delete - set isActive to false
    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: 'Produto removido com sucesso'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Update stock (Admin only)
router.patch('/:id/stock', auth, adminAuth, [
  body('size')
    .notEmpty()
    .withMessage('Tamanho é obrigatório'),
  body('quantity')
    .isInt()
    .withMessage('Quantidade deve ser um número inteiro')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { size, quantity } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    await product.updateStock(size, quantity);

    res.json({
      success: true,
      message: 'Estoque atualizado com sucesso',
      data: { product }
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
});

export default router;