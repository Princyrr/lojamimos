import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true,
    maxlength: [200, 'Nome deve ter no máximo 200 caracteres'],
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true,
    maxlength: [2000, 'Descrição deve ter no máximo 2000 caracteres'],
  },
  price: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: [0, 'Preço deve ser maior ou igual a zero'],
  },
  originalPrice: {
    type: Number,
    min: [0, 'Preço original deve ser maior ou igual a zero'],
  },
  category: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    enum: ['bebe', 'menino', 'menina', 'unissex'],
    lowercase: true,
  },
  subcategory: {
    type: String,
    enum: ['roupas', 'calcados', 'acessorios', 'pijamas', 'underwear'],
    lowercase: true,
  },
  brand: {
    type: String,
    trim: true,
    maxlength: [100, 'Marca deve ter no máximo 100 caracteres'],
  },
  material: {
    type: String,
    trim: true,
    maxlength: [200, 'Material deve ter no máximo 200 caracteres'],
  },
  sizes: [
    {
      name: {
        type: String,
        required: true,
        enum: [
          'RN', 'P', 'M', 'G', 'GG',
          '0-3M', '3-6M', '6-9M', '9-12M', '12-18M', '18-24M',
          '2T', '3T', '4T', '5T',
          '6', '7', '8', '9', '10', '12', '14', '16'
        ],
      },
      stock: {
        type: Number,
        required: true,
        min: [0, 'Estoque não pode ser negativo'],
        default: 0,
      },
      sku: {
        type: String,
        required: true,
        unique: true,
      },
    },
  ],
  colors: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      hexCode: {
        type: String,
        match: [/^#[0-9A-F]{6}$/i, 'Código de cor inválido'],
      },
      available: {
        type: Boolean,
        default: true,
      },
    },
  ],
  ageRange: {
    min: {
      type: Number,
      min: 0,
      max: 18,
    },
    max: {
      type: Number,
      min: 0,
      max: 18,
    },
    unit: {
      type: String,
      enum: ['months', 'years'],
      default: 'years',
    },
  },
  images: [
    {
      url: {
        type: String,
        required: true,
      },
      alt: String,
      isPrimary: {
        type: Boolean,
        default: false,
      },
      order: {
        type: Number,
        default: 0,
      },
    },
  ],
  features: [String],
  careInstructions: [String],
  weight: {
    type: Number,
    min: 0,
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'inches'],
      default: 'cm',
    },
  },
  seo: {
    title: String,
    description: String,
    keywords: [String],
  },
  ratings: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    count: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isOnSale: {
    type: Boolean,
    default: false,
  },
  saleStartDate: Date,
  saleEndDate: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Indexes para performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: 1, isActive: 1 });

// Virtual para estoque total
productSchema.virtual('totalStock').get(function () {
  return this.sizes.reduce((total, size) => total + size.stock, 0);
});

// Virtual para percentual de desconto
productSchema.virtual('discountPercentage').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Middleware pre-save para garantir somente uma imagem primária
productSchema.pre('save', function (next) {
  if (this.images && this.images.length > 0) {
    const primaryImages = this.images.filter((img) => img.isPrimary);
    if (primaryImages.length === 0) {
      this.images[0].isPrimary = true;
    } else if (primaryImages.length > 1) {
      this.images.forEach((img, idx) => {
        img.isPrimary = idx === 0;
      });
    }
  }
  next();
});

// Método estático para buscar produtos por categoria
productSchema.statics.getByCategory = function (category, limit = 10) {
  return this.find({ category, isActive: true })
    .limit(limit)
    .sort({ createdAt: -1 });
};

// Método estático para buscar produtos em destaque
productSchema.statics.getFeatured = function (limit = 8) {
  return this.find({ isFeatured: true, isActive: true })
    .limit(limit)
    .sort({ createdAt: -1 });
};

// Método para checar se produto tem estoque, opcionalmente por tamanho
productSchema.methods.isInStock = function (size = null) {
  if (size) {
    const sizeData = this.sizes.find((s) => s.name === size);
    return sizeData ? sizeData.stock > 0 : false;
  }
  return this.totalStock > 0;
};

// Método para atualizar estoque por tamanho
productSchema.methods.updateStock = function (size, quantity) {
  const sizeData = this.sizes.find((s) => s.name === size);
  if (sizeData) {
    sizeData.stock = Math.max(0, sizeData.stock - quantity);
    return this.save();
  }
  throw new Error('Tamanho não encontrado');
};

const Product = mongoose.model('Product', productSchema);

export default Product;
