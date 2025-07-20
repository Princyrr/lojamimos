import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Grid, List, Search, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';
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

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  ages: string[];
  sizes: string[];
  colors: string[];
  description: string;
  inStock: boolean;
}

export const Products: React.FC = () => {
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Vestido Xadrez Margaridas',
      price: 89.90,
      originalPrice: 119.90,
      image: image1,
      category: 'menina',
      ages: ['2-4 anos', '4-6 anos', '6-8 anos','8-10 anos', '10-12 anos', '12-14 anos'],
      sizes: ['4', '6', '8','10','12','14'],
      colors: ['Rosa', 'Azul', 'Branco'],
      description: 'Lindo vestido xadrez, floral perfeito para festas juninas.',
      inStock: true
    },
    {
      id: '2',
      name: 'Vestido Maria Flor',
      price: 69.90,
      image: image2,
      category: 'menina',
      ages: ['2-4 anos', '4-6 anos', '6-8 anos','8-10 anos', '10-12 anos', '12-14 anos'],
      sizes: ['4', '6', '8','10','12','14'],
      colors: ['Rosa', 'Cinza', 'Preto'],
      description: 'Vestido vermelho Maria Flor, com bordados na frente de rosas',
      inStock: true
    },
    {
      id: '3',
      name: 'Vestido Tricolê',
      price: 39.90,
      image: image3,
      category: 'menina',
       ages: ['2-4 anos', '4-6 anos', '6-8 anos','8-10 anos', '10-12 anos', '12-14 anos'],
      sizes: ['4', '6', '8','10','12','14'],
      colors: ['Amarelo', 'Rosa', 'Azul', 'Branco'],
      description: 'Vestido confortável, três cores, rodado e com manga.',
      inStock: true
    },
    {
      id: '4',
      name: 'Vestido Melissa Verde',
      price: 59.90,
      originalPrice: 79.90,
      image: image4,
      category: 'menina',
      ages: ['2-4 anos', '4-6 anos', '6-8 anos'],
      sizes: ['P', 'M', 'G'],
      colors: ['Rosa', 'Roxo', 'Azul'],
      description: 'Vestido super confortável, cor verde, tecido crepe especial.',
      inStock: true
    },
    {
      id: '5',
      name: 'Vestido Jardim Encantado',
      price: 64.90,
      image: image5,
      category: 'menina',
       ages: ['2-4 anos', '4-6 anos', '6-8 anos','8-10 anos', '10-12 anos', '12-14 anos'],
      sizes: ['4', '6', '8','10','12','14'],
      colors: ['Verde', 'Azul', 'Cinza'],
      description: 'Vestido crepe especial, com estampa única e encantada.',
      inStock: true
    },
    {
      id: '6',
      name: 'Vestido Milena Xadrez',
      price: 69.90,
      image: image6,
      category: 'menina',
       ages: ['2-4 anos', '4-6 anos', '6-8 anos','8-10 anos', '10-12 anos', '12-14 anos'],
      sizes: ['4', '6', '8','10','12','14'],
      colors: ['Rosa', 'Azul', 'Branco', 'Amarelo'],
      description: 'Vestido Xadrez, com corações super confortável.',
      inStock: true
    },
{
      id: '7',
      name: 'Vestido Katia',
      price: 69.90,
      image: image7,
      category: 'menina',
      ages: ['2-4 anos', '4-6 anos', '6-8 anos','8-10 anos', '10-12 anos', '12-14 anos'],
      sizes: ['4', '6', '8','10','12','14'],
      colors: ['Rosa', 'Azul', 'Branco', 'Amarelo'],
      description: 'Vestido com estampa personalizada, a criançada adora.',
      inStock: true
    },
    {
      id: '8',
      name: 'Vestido Napolitano',
      price: 69.90,
      image: image8,
      category: 'menina',
       ages: ['2-4 anos', '4-6 anos', '6-8 anos','8-10 anos', '10-12 anos', '12-14 anos'],
      sizes: ['4', '6', '8','10','12','14'],
      colors: ['Rosa', 'Azul', 'Branco', 'Amarelo'],
      description: 'Vestido colorido, tecido crepe especial.',
      inStock: true
    },
    {
      id: '9',
      name: 'Conjunto Xadrez',
      price: 69.90,
      image: image9,
      category: 'menina',
       ages: ['2-4 anos', '4-6 anos', '6-8 anos','8-10 anos', '10-12 anos', '12-14 anos'],
      sizes: ['4', '6', '8','10','12','14'],
      colors: ['Rosa', 'Azul', 'Branco', 'Amarelo'],
      description: 'Conjunto com blusa xadrez e short-saia.',
      inStock: true
    },
    {
      id: '10',
      name: 'Vestido  Maya Xadrez',
      price: 69.90,
      image: image10,
      category: 'menina',
       ages: ['2-4 anos', '4-6 anos', '6-8 anos','8-10 anos', '10-12 anos', '12-14 anos'],
      sizes: ['4', '6', '8','10','12','14'],
      colors: ['Rosa', 'Azul', 'Branco', 'Amarelo'],
      description: 'Roupa de festa com detalhes em Xadrez para curtir com a família...',
      inStock: false
    },
{
      id: '11',
      name: 'Roupa Batizado',
      price: 69.90,
      image: image11,
      category: 'bebe',
       ages: ['0-2 anos'],
      sizes: ['6 m até 2 anos'],
      colors: ['Branco','Cinza'],
      description: 'Roupa para Batizado, blusa e calsa, super confortável',
      inStock: true
    },
    {
      id: '12',
      name: 'Roupa Social',
      price: 69.90,
      image: image12,
      category: 'menino',
       ages: ['2-4 anos', '4-6 anos', '6-8 anos','8-10 anos', '10-12 anos', '12-14 anos'],
      sizes: ['4', '6', '8','10','12','14'],
      colors: ['Azul', 'Branco', 'Cinza'],
      description: 'Conjunto social com camisa e calça, ideal para festas.',
      inStock: true
    }
  ]);

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedAge, setSelectedAge] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevancia');

  const { addItem } = useCartStore();

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by age
    if (selectedAge !== 'todos') {
      filtered = filtered.filter(product => product.ages.includes(selectedAge));
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    switch (sortBy) {
      case 'menor-preco':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'maior-preco':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'nome':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedAge, searchTerm, sortBy, products]);

  const categories = [
    { value: 'todos', label: 'Todos os Produtos' },
    { value: 'bebe', label: 'Bebê (0-2 anos)' },
    { value: 'menino', label: 'Menino (2-12 anos)' },
    { value: 'menina', label: 'Menina (2-12 anos)' }
  ];

  const ageRanges = [
    { value: 'todos', label: 'Todas as Idades' },
    { value: '0-6 meses', label: '0-6 meses' },
    { value: '6-12 meses', label: '6-12 meses' },
    { value: '12-18 meses', label: '12-18 meses' },
    { value: '2-4 anos', label: '2-4 anos' },
    { value: '4-6 anos', label: '4-6 anos' },
    { value: '6-8 anos', label: '6-8 anos' },
    { value: '8-10 anos', label: '8-10 anos' }
  ];

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) {
      toast.error('Produto fora de estoque');
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.sizes[0],
      color: product.colors[0]
    });
    
    toast.success('Produto adicionado ao carrinho!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nossos Produtos</h1>
          <p className="text-gray-600">Encontre as melhores roupas para seus pequenos</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filtros</span>
            </button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {ageRanges.map(age => (
                  <option key={age.value} value={age.value}>
                    {age.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="relevancia">Relevância</option>
                <option value="menor-preco">Menor Preço</option>
                <option value="maior-preco">Maior Preço</option>
                <option value="nome">Nome A-Z</option>
              </select>

              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:text-primary-600'} transition-colors`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 border-l border-gray-300 ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:text-primary-600'} transition-colors`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mt-4 pt-4 border-t border-gray-200 space-y-4"
              >
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {ageRanges.map(age => (
                    <option key={age.value} value={age.value}>
                      {age.label}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="relevancia">Relevância</option>
                  <option value="menor-preco">Menor Preço</option>
                  <option value="maior-preco">Maior Preço</option>
                  <option value="nome">Nome A-Z</option>
                </select>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'} relative overflow-hidden`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {product.originalPrice && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                      Fora de Estoque
                    </span>
                  </div>
                )}
              </div>

              <div className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                <div>
                  <span className="text-sm font-medium text-primary-600 mb-1 block">
                    {categories.find(c => c.value === product.category)?.label}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                    <Link to={`/produto/${product.id}`}>
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Tamanhos:</span>
                    <span>{product.sizes.join(', ')}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/produto/${product.id}`}
                      className="flex-1 bg-gray-100 text-gray-900 text-center py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Ver Detalhes
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-1"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Comprar</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros ou buscar por outros termos
            </p>
            <button
              onClick={() => {
                setSelectedCategory('todos');
                setSelectedAge('todos');
                setSearchTerm('');
                setSortBy('relevancia');
              }}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};