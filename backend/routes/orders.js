import express from 'express';
import { body, query, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get user orders
router.get('/my-orders', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Página deve ser um número positivo'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit deve ser entre 1 e 50'),
  query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']).withMessage('Status inválido')
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
      limit = 10,
      status
    } = req.query;

    const filter = { customer: req.user.userId };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('items.product', 'name images'),
      Order.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get all orders (Admin only)
router.get('/', auth, adminAuth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Página deve ser um número positivo'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve ser entre 1 e 100'),
  query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']).withMessage('Status inválido')
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
      status,
      customer,
      search
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (customer) filter.customer = customer;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customerInfo.name': { $regex: search, $options: 'i' } },
        { 'customerInfo.email': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('customer', 'name email')
        .populate('items.product', 'name images'),
      Order.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    // Check if user can access this order
    if (req.user.role !== 'admin' && order.customer._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID do pedido inválido'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Create order
router.post('/', auth, [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Pelo menos um item deve ser especificado'),
  body('items.*.product')
    .isMongoId()
    .withMessage('ID do produto inválido'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser um número positivo'),
  body('items.*.size')
    .notEmpty()
    .withMessage('Tamanho é obrigatório'),
  body('items.*.color')
    .notEmpty()
    .withMessage('Cor é obrigatória'),
  body('customerInfo.name')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório'),
  body('customerInfo.email')
    .isEmail()
    .withMessage('Email inválido'),
  body('customerInfo.phone')
    .notEmpty()
    .withMessage('Telefone é obrigatório'),
  body('shippingAddress.street')
    .notEmpty()
    .withMessage('Endereço é obrigatório'),
  body('shippingAddress.city')
    .notEmpty()
    .withMessage('Cidade é obrigatória'),
  body('shippingAddress.state')
    .notEmpty()
    .withMessage('Estado é obrigatório'),
  body('shippingAddress.zipCode')
    .notEmpty()
    .withMessage('CEP é obrigatório'),
  body('payment.method')
    .isIn(['credit-card', 'pix', 'mercado-pago', 'pagseguro', 'boleto'])
    .withMessage('Método de pagamento inválido')
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

    const { items, customerInfo, shippingAddress, payment, notes } = req.body;

    // Validate products and check stock
    const productIds = items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds }, isActive: true });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Um ou mais produtos não foram encontrados'
      });
    }

    // Prepare order items and calculate pricing
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.product);
      
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Produto não encontrado: ${item.product}`
        });
      }

      // Check stock
      if (!product.isInStock(item.size)) {
        return res.status(400).json({
          success: false,
          message: `Produto "${product.name}" tamanho "${item.size}" fora de estoque`
        });
      }

      const sizeData = product.sizes.find(s => s.name === item.size);
      if (sizeData.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Estoque insuficiente para "${product.name}" tamanho "${item.size}". Disponível: ${sizeData.stock}`
        });
      }

      const orderItem = {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        sku: sizeData.sku,
        image: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url
      };

      orderItems.push(orderItem);
      subtotal += product.price * item.quantity;
    }

    // Calculate shipping (free for orders above R$ 150)
    const shipping = subtotal >= 150 ? 0 : 15;
    const total = subtotal + shipping;

    // Create order
    const order = new Order({
      customer: req.user.userId,
      customerInfo,
      items: orderItems,
      pricing: {
        subtotal,
        shipping,
        total
      },
      shippingAddress,
      payment,
      notes
    });

    await order.save();

    // Update product stock
    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.product);
      await product.updateStock(item.size, item.quantity);
    }

    // Populate order for response
    await order.populate('items.product', 'name images');

    res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Update order status (Admin only)
router.patch('/:id/status', auth, adminAuth, [
  body('status')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'])
    .withMessage('Status inválido'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Mensagem deve ter no máximo 500 caracteres')
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

    const { status, message } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    order.status = status;
    await order.addTimelineEntry(status, message || `Status alterado para: ${status}`, req.user.userId);

    res.json({
      success: true,
      message: 'Status do pedido atualizado com sucesso',
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Cancel order
router.patch('/:id/cancel', auth, [
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Motivo deve ter no máximo 500 caracteres')
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

    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    // Check if user can cancel this order
    if (req.user.role !== 'admin' && order.customer.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Este pedido não pode ser cancelado'
      });
    }

    order.status = 'cancelled';
    const message = reason ? `Pedido cancelado. Motivo: ${reason}` : 'Pedido cancelado';
    await order.addTimelineEntry('cancelled', message, req.user.userId);

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        const sizeData = product.sizes.find(s => s.name === item.size);
        if (sizeData) {
          sizeData.stock += item.quantity;
          await product.save();
        }
      }
    }

    res.json({
      success: true,
      message: 'Pedido cancelado com sucesso',
      data: { order }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;