import express from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Process PIX payment
router.post('/pix', auth, [
  body('orderId')
    .isMongoId()
    .withMessage('ID do pedido inválido'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Valor inválido')
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

    const { orderId, amount } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    // Check if user owns this order
    if (order.customer.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    // Validate amount
    if (Math.abs(amount - order.pricing.total) > 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Valor do pagamento não confere com o total do pedido'
      });
    }

    // Generate PIX code (mock implementation)
    const pixCode = generatePixCode(order);
    const pixQrCode = generatePixQrCode(pixCode);

    // Update order payment info
    order.payment.pixCode = pixCode;
    order.payment.pixQrCode = pixQrCode;
    order.payment.status = 'pending';
    
    await order.save();
    await order.addTimelineEntry('payment_pending', 'Aguardando pagamento PIX');

    res.json({
      success: true,
      message: 'Código PIX gerado com sucesso',
      data: {
        pixCode,
        pixQrCode,
        amount: order.pricing.total,
        expiresIn: 30 * 60 // 30 minutes in seconds
      }
    });
  } catch (error) {
    console.error('PIX payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Process credit card payment
router.post('/credit-card', auth, [
  body('orderId')
    .isMongoId()
    .withMessage('ID do pedido inválido'),
  body('cardData.number')
    .isLength({ min: 13, max: 19 })
    .withMessage('Número do cartão inválido'),
  body('cardData.holderName')
    .trim()
    .notEmpty()
    .withMessage('Nome do portador é obrigatório'),
  body('cardData.expiryMonth')
    .isInt({ min: 1, max: 12 })
    .withMessage('Mês de expiração inválido'),
  body('cardData.expiryYear')
    .isInt({ min: new Date().getFullYear() })
    .withMessage('Ano de expiração inválido'),
  body('cardData.cvv')
    .isLength({ min: 3, max: 4 })
    .withMessage('CVV inválido')
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

    const { orderId, cardData } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    // Check if user owns this order
    if (order.customer.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    // Process payment (mock implementation)
    const paymentResult = await processCreditCardPayment(order, cardData);

    if (paymentResult.success) {
      await order.updatePaymentStatus('paid', paymentResult.transactionId, paymentResult);
      await order.addTimelineEntry('payment_confirmed', 'Pagamento confirmado');
      
      // Update order status
      order.status = 'confirmed';
      await order.save();

      res.json({
        success: true,
        message: 'Pagamento processado com sucesso',
        data: {
          transactionId: paymentResult.transactionId,
          status: 'paid'
        }
      });
    } else {
      await order.updatePaymentStatus('failed', null, paymentResult);
      await order.addTimelineEntry('payment_failed', `Falha no pagamento: ${paymentResult.message}`);

      res.status(400).json({
        success: false,
        message: paymentResult.message || 'Falha no processamento do pagamento'
      });
    }
  } catch (error) {
    console.error('Credit card payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Process Mercado Pago payment
router.post('/mercado-pago', auth, [
  body('orderId')
    .isMongoId()
    .withMessage('ID do pedido inválido'),
  body('paymentMethodId')
    .notEmpty()
    .withMessage('Método de pagamento é obrigatório'),
  body('token')
    .notEmpty()
    .withMessage('Token de pagamento é obrigatório')
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

    const { orderId, paymentMethodId, token } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    // Check if user owns this order
    if (order.customer.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    // Process payment with Mercado Pago (mock implementation)
    const paymentResult = await processMercadoPagoPayment(order, { paymentMethodId, token });

    if (paymentResult.success) {
      await order.updatePaymentStatus('paid', paymentResult.transactionId, paymentResult);
      await order.addTimelineEntry('payment_confirmed', 'Pagamento confirmado via Mercado Pago');
      
      order.status = 'confirmed';
      await order.save();

      res.json({
        success: true,
        message: 'Pagamento processado com sucesso',
        data: {
          transactionId: paymentResult.transactionId,
          status: 'paid'
        }
      });
    } else {
      await order.updatePaymentStatus('failed', null, paymentResult);
      await order.addTimelineEntry('payment_failed', `Falha no pagamento: ${paymentResult.message}`);

      res.status(400).json({
        success: false,
        message: paymentResult.message || 'Falha no processamento do pagamento'
      });
    }
  } catch (error) {
    console.error('Mercado Pago payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Process PagSeguro payment
router.post('/pagseguro', auth, [
  body('orderId')
    .isMongoId()
    .withMessage('ID do pedido inválido'),
  body('paymentMethod')
    .isIn(['credit_card', 'boleto', 'pix'])
    .withMessage('Método de pagamento inválido'),
  body('senderHash')
    .notEmpty()
    .withMessage('Hash do remetente é obrigatório')
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

    const { orderId, paymentMethod, senderHash, cardData } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    // Check if user owns this order
    if (order.customer.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    // Process payment with PagSeguro (mock implementation)
    const paymentResult = await processPagSeguroPayment(order, { 
      paymentMethod, 
      senderHash, 
      cardData 
    });

    if (paymentResult.success) {
      await order.updatePaymentStatus('paid', paymentResult.transactionId, paymentResult);
      await order.addTimelineEntry('payment_confirmed', 'Pagamento confirmado via PagSeguro');
      
      order.status = 'confirmed';
      await order.save();

      res.json({
        success: true,
        message: 'Pagamento processado com sucesso',
        data: {
          transactionId: paymentResult.transactionId,
          status: 'paid',
          boletoUrl: paymentResult.boletoUrl // For boleto payments
        }
      });
    } else {
      await order.updatePaymentStatus('failed', null, paymentResult);
      await order.addTimelineEntry('payment_failed', `Falha no pagamento: ${paymentResult.message}`);

      res.status(400).json({
        success: false,
        message: paymentResult.message || 'Falha no processamento do pagamento'
      });
    }
  } catch (error) {
    console.error('PagSeguro payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Check payment status
router.get('/status/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    // Check if user owns this order
    if (order.customer.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    res.json({
      success: true,
      data: {
        paymentStatus: order.payment.status,
        orderStatus: order.status,
        transactionId: order.payment.transactionId,
        paymentMethod: order.payment.method,
        pixCode: order.payment.pixCode,
        pixQrCode: order.payment.pixQrCode,
        boletoUrl: order.payment.boletoUrl
      }
    });
  } catch (error) {
    console.error('Check payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Mock payment processing functions
function generatePixCode(order) {
  // In production, this would integrate with a real PIX provider
  return `00020126580014BR.GOV.BCB.PIX0136${process.env.PIX_KEY || 'mock-pix-key'}5204000053039865802BR5925PEQUENOS MIMOS LTDA6009SAO PAULO62070503***6304${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
}

function generatePixQrCode(pixCode) {
  // In production, this would generate a real QR code
  return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
}

async function processCreditCardPayment(order, cardData) {
  // Mock credit card processing
  // In production, integrate with real payment gateway
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock validation
  if (cardData.number.includes('4111')) {
    return {
      success: true,
      transactionId: `CC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: 'Pagamento aprovado',
      authCode: Math.random().toString(36).substr(2, 6).toUpperCase()
    };
  } else {
    return {
      success: false,
      message: 'Cartão recusado',
      errorCode: 'CARD_DECLINED'
    };
  }
}

async function processMercadoPagoPayment(order, paymentData) {
  // Mock Mercado Pago processing
  // In production, integrate with Mercado Pago API
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    success: true,
    transactionId: `MP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    message: 'Pagamento aprovado via Mercado Pago'
  };
}

async function processPagSeguroPayment(order, paymentData) {
  // Mock PagSeguro processing
  // In production, integrate with PagSeguro API
  
  await new Promise(resolve => setTimeout(resolve, 1800));
  
  const result = {
    success: true,
    transactionId: `PS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    message: 'Pagamento processado via PagSeguro'
  };
  
  // Add boleto URL for boleto payments
  if (paymentData.paymentMethod === 'boleto') {
    result.boletoUrl = `https://pagseguro.uol.com.br/checkout/boleto/${result.transactionId}`;
  }
  
  return result;
}

export default router;