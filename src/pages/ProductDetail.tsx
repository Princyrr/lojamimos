import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Star, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

// Imagens mock (substitua pelos seus imports reais)
import image1 from '../assets/roupa1.jpg'
import image2 from '../assets/roupa2.webp'
import image3 from '../assets/roupa3.webp'
import image4 from '../assets/roupa4.webp'
import image5 from '../assets/roupa5.webp'
import image6 from '../assets/roupa6.webp'
import image7 from '../assets/roupa7.webp'
import image8 from '../assets/roupa8.jpg'
import image9 from '../assets/roupa9.jpg'
import image10 from '../assets/roupa10.webp'
import image11 from '../assets/conjuntobatizado.webp'
import image12 from '../assets/roupasocial.webp'


const mockProducts = [
  {
    id: '1',
    name: 'Vestido Xadrez Margaridas',
    price: 89.90,
    originalPrice: 119.90,
    images: [image1],
    category: 'menina',
    ages: ['2-4 anos', '4-6 anos', '6-8 anos', '8-10 anos', '10-12 anos', '12-14 anos'],
    sizes: ['4', '6', '8', '10', '12', '14'],
    colors: ['Rosa', 'Azul', 'Branco'],
    description: 'Lindo vestido xadrez, floral perfeito para festas juninas.',
    inStock: true,
    rating: 4.5,
    reviews: 10,
    features: ['Tecido confortável', 'Lavável na máquina', 'Certificação OEKO-TEX']
  },
  {
    id: '2',
    name: 'Vestido Maria Flor',
    price: 69.90,
    images: [image2],
    category: 'menina',
    ages: ['2-4 anos', '4-6 anos', '6-8 anos', '8-10 anos', '10-12 anos', '12-14 anos'],
    sizes: ['4', '6', '8', '10', '12', '14'],
    colors: ['Rosa', 'Cinza', 'Preto'],
    description: 'Vestido vermelho Maria Flor, com bordados na frente de rosas',
    inStock: true,
    rating: 4.0,
    reviews: 8,
    features: ['Detalhes bordados', 'Tecido leve', 'Confortável para crianças']
  },
  {
    id: '3',
    name: 'Vestido Tricolê',
    price: 39.90,
    images: [image3],
    category: 'menina',
    ages: ['2-4 anos', '4-6 anos', '6-8 anos', '8-10 anos', '10-12 anos', '12-14 anos'],
    sizes: ['4', '6', '8', '10', '12', '14'],
    colors: ['Amarelo', 'Rosa', 'Azul', 'Branco'],
    description: 'Vestido confortável, três cores, rodado e com manga.',
    inStock: true,
    rating: 4.3,
    reviews: 12,
    features: ['Tecido leve', 'Manga comprida', 'Rodado']
  },
  {
    id: '4',
    name: 'Vestido Melissa Verde',
    price: 59.90,
    originalPrice: 79.90,
    images: [image4],
    category: 'menina',
    ages: ['2-4 anos', '4-6 anos', '6-8 anos'],
    sizes: ['P', 'M', 'G'],
    colors: ['Rosa', 'Roxo', 'Azul'],
    description: 'Vestido super confortável, cor verde, tecido crepe especial.',
    inStock: true,
    rating: 4.6,
    reviews: 9,
    features: ['Tecido crepe', 'Confortável', 'Lavável na máquina']
  },
  {
    id: '5',
    name: 'Vestido Jardim Encantado',
    price: 64.90,
    images: [image5],
    category: 'menina',
    ages: ['2-4 anos', '4-6 anos', '6-8 anos', '8-10 anos', '10-12 anos', '12-14 anos'],
    sizes: ['4', '6', '8', '10', '12', '14'],
    colors: ['Verde', 'Azul', 'Cinza'],
    description: 'Vestido crepe especial, com estampa única e encantada.',
    inStock: true,
    rating: 4.4,
    reviews: 11,
    features: ['Estampa única', 'Tecido leve', 'Lavável na máquina']
  },
  {
    id: '6',
    name: 'Vestido Milena Xadrez',
    price: 69.90,
    images: [image6],
    category: 'menina',
    ages: ['2-4 anos', '4-6 anos', '6-8 anos', '8-10 anos', '10-12 anos', '12-14 anos'],
    sizes: ['4', '6', '8', '10', '12', '14'],
    colors: ['Rosa', 'Azul', 'Branco', 'Amarelo'],
    description: 'Vestido Xadrez, com corações super confortável.',
    inStock: true,
    rating: 4.2,
    reviews: 7,
    features: ['Estampa xadrez', 'Confortável', 'Botões frontais']
  },
  {
    id: '7',
    name: 'Vestido Katia',
    price: 69.90,
    images: [image7],
    category: 'menina',
    ages: ['2-4 anos', '4-6 anos', '6-8 anos', '8-10 anos', '10-12 anos', '12-14 anos'],
    sizes: ['4', '6', '8', '10', '12', '14'],
    colors: ['Rosa', 'Azul', 'Branco', 'Amarelo'],
    description: 'Vestido com estampa personalizada, a criançada adora.',
    inStock: true,
    rating: 4.7,
    reviews: 15,
    features: ['Estampa personalizada', 'Tecido macio', 'Lavável na máquina']
  },
  {
    id: '8',
    name: 'Vestido Napolitado',
    price: 69.90,
    images: [image8],
    category: 'menina',
    ages: ['2-4 anos', '4-6 anos', '6-8 anos', '8-10 anos', '10-12 anos', '12-14 anos'],
    sizes: ['4', '6', '8', '10', '12', '14'],
    colors: ['Rosa', 'Azul', 'Branco', 'Amarelo'],
    description: 'Vestidos com 3 cores, tecido crepe especial',
    inStock: true,
    rating: 4.1,
    reviews: 5,
    features: ['Vestido', '3 cores']
  },
  {
    id: '9',
    name: 'Conjunto Xadrez',
    price: 69.90,
    images: [image9],
    category: 'menina',
    ages: ['2-4 anos', '4-6 anos', '6-8 anos', '8-10 anos', '10-12 anos', '12-14 anos'],
    sizes: ['4', '6', '8', '10', '12', '14'],
    colors: ['Rosa', 'Azul', 'Branco', 'Amarelo'],
    description: 'Conjunto com blusa xadrez e short-saia.',
    inStock: true,
    rating: 4.0,
    reviews: 4,
    features: ['Conjunto xadrez', 'Confortável']
  },
  {
    id: '10',
    name: 'Roupa Maya Xadrez',
    price: 69.90,
    images: [image10],
    category: 'menina',
    ages: ['2-4 anos', '4-6 anos', '6-8 anos', '8-10 anos', '10-12 anos', '12-14 anos'],
    sizes: ['4', '6', '8', '10', '12', '14'],
    colors: ['Rosa', 'Azul', 'Branco', 'Amarelo'],
    description: 'Vestido com detalhes em Xadrez',
    inStock: false,
    rating: 3.8,
    reviews: 3,
    features: ['Vestido Xadrez', 'Ideal para festas Juninas']
  },
  {
    id: '11',
    name: 'Roupa Batizado',
    price: 69.90,
    images: [image11],
    category: 'bebe',
    ages: ['0-2 anos'],
    sizes: ['6m ','8m','10m','1a','2a'],
    colors: ['Branco', 'Cinza'],
    description: 'Conjuntinho para Batizado, super Confortável',
    inStock: true,
    rating: 3.8,
    reviews: 3,
    features: ['Roupa Confortável', 'Ideal para batizado']
  },
  {
    id: '12',
    name: 'Roupa Social Masculina',
    price: 69.90,
    images: [image12],
    category: 'menino',
    ages: ['2-4 anos', '4-6 anos', '6-8 anos', '8-10 anos', '10-12 anos', '12-14 anos'],
    sizes: ['4', '6', '8', '10', '12', '14'],
    colors: [ 'Azul', 'Branco', 'Cinza'],
    description: 'Conjunto de roupa Social para meninos, com camisa e calça de tecido leve.',
    inStock: true,
    rating: 4.8,
    reviews: 3,
    features: ['Roupa social', 'festas']
  }
];

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<typeof mockProducts[0] | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const { addItem } = useCartStore();

  useEffect(() => {
    if (!id) return;
    const found = mockProducts.find(p => p.id === id) || null;
    setProduct(found);
    setSelectedImage(0);
    setSelectedSize(found?.sizes?.[0] || '');
    setSelectedColor(found?.colors?.[0] || '');
  }, [id]);

  if (!product) {
    return <div className="p-10 text-center text-red-500">Produto não encontrado.</div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Por favor, selecione um tamanho');
      return;
    }
    if (!selectedColor) {
      toast.error('Por favor, selecione uma cor');
      return;
    }
    if (!product.inStock) {
      toast.error('Produto indisponível no momento');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[selectedImage],
        size: selectedSize,
        color: selectedColor,
      });
    }
    toast.success(`${quantity} item(s) adicionado(s) ao carrinho!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Implementar navegação para checkout
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/produtos" className="hover:text-primary-600 transition-colors">Produtos</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Back Button */}
        <Link
          to="/produtos"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar aos produtos</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Thumbnail Images */}
            <div className="flex space-x-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-primary-500 ring-2 ring-primary-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="text-sm font-medium text-primary-600 mb-2 block">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating || '0'} ({product.reviews || '0'} avaliações)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tamanho</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                      selectedSize === size
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cor</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                      selectedColor === color
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantidade</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r from-primary-400 to-secondary-400 text-white py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Comprar Agora
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-4 rounded-xl font-semibold border-2 flex items-center justify-center space-x-2 transition-all ${
                    product.inStock
                      ? 'bg-white text-gray-900 border-gray-300 hover:border-primary-300 hover:text-primary-600'
                      : 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Adicionar ao Carrinho</span>
                </button>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex-1 py-3 rounded-xl font-medium border-2 transition-all flex items-center justify-center space-x-2 ${
                    isFavorite
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-gray-300 hover:border-red-300 hover:text-red-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  <span>Favoritar</span>
                </button>
                <button className="flex-1 py-3 rounded-xl font-medium border-2 border-gray-300 hover:border-gray-400 transition-all flex items-center justify-center space-x-2">
                  <Share2 className="w-5 h-5" />
                  <span>Compartilhar</span>
                </button>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Características</h3>
              <ul className="space-y-2">
                {product.features?.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-gray-600">
                    <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Guarantees */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Truck className="w-6 h-6 text-primary-600" />
                <div>
                  <p className="font-semibold text-gray-900">Frete Grátis</p>
                  <p className="text-sm text-gray-600">Acima de R$ 150,00</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-6 h-6 text-primary-600" />
                <div>
                  <p className="font-semibold text-gray-900">Trocas e Devoluções</p>
                  <p className="text-sm text-gray-600">Até 30 dias após a compra</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-primary-600" />
                <div>
                  <p className="font-semibold text-gray-900">Compra Segura</p>
                  <p className="text-sm text-gray-600">Seus dados protegidos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
