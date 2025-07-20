import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    cpf: String
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    size: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    sku: String,
    image: String
  }],
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    shipping: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    discount: {
      type: Number,
      min: 0,
      default: 0
    },
    tax: {
      type: Number,
      min: 0,
      default: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    number: {
      type: String,
      required: true
    },
    complement: String,
    neighborhood: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'Brasil'
    }
  },
  payment: {
    method: {
      type: String,
      required: true,
      enum: ['credit-card', 'pix', 'mercado-pago', 'pagseguro', 'boleto']
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'processing', 'paid', 'failed', 'refunded', 'cancelled'],
      default: 'pending'
    },
    transactionId: String,
    paymentDate: Date,
    gatewayResponse: mongoose.Mixed,
    pixCode: String,
    pixQrCode: String,
    boletoUrl: String,
    boletoCode: String
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  tracking: {
    code: String,
    company: String,
    url: String,
    estimatedDelivery: Date,
    deliveredAt: Date
  },
  timeline: [{
    status: {
      type: String,
      required: true
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  notes: {
    customer: String,
    internal: String
  },
  coupon: {
    code: String,
    discount: Number,
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    }
  },
  refund: {
    amount: Number,
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'processed']
    },
    requestedAt: Date,
    processedAt: Date,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `PM${Date.now().toString().slice(-6)}${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

// Pre-save middleware to update timeline
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.timeline.push({
      status: this.status,
      message: `Status alterado para: ${this.status}`,
      timestamp: new Date()
    });
  }
  next();
});

// Virtual for formatted order number
orderSchema.virtual('formattedOrderNumber').get(function() {
  return `#${this.orderNumber}`;
});

// Virtual for total items
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Static method to get orders by customer
orderSchema.statics.getByCustomer = function(customerId, limit = 10) {
  return this.find({ customer: customerId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('items.product', 'name images');
};

// Static method to get orders by status
orderSchema.statics.getByStatus = function(status, limit = 50) {
  return this.find({ status })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('customer', 'name email')
    .populate('items.product', 'name images');
};

// Method to add timeline entry
orderSchema.methods.addTimelineEntry = function(status, message, updatedBy = null) {
  this.timeline.push({
    status,
    message,
    timestamp: new Date(),
    updatedBy
  });
  return this.save();
};

// Method to update payment status
orderSchema.methods.updatePaymentStatus = function(status, transactionId = null, gatewayResponse = null) {
  this.payment.status = status;
  if (transactionId) this.payment.transactionId = transactionId;
  if (gatewayResponse) this.payment.gatewayResponse = gatewayResponse;
  if (status === 'paid') this.payment.paymentDate = new Date();
  
  return this.save();
};

// Method to calculate total
orderSchema.methods.calculateTotal = function() {
  const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + this.pricing.shipping - this.pricing.discount + this.pricing.tax;
  
  this.pricing.subtotal = subtotal;
  this.pricing.total = total;
  
  return this;
};

const Order = mongoose.model('Order', orderSchema);

export default Order;