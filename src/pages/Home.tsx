import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';
import vestidoFloral from '../assets/vestidofloral.webp';
import colete from '../assets/colete.png';
import bodybebe from '../assets/body.webp';
import pijama from '../assets/pijama.jpg';
import bannerMenina from '../assets/bannermenina.png';
import bannerMenino from '../assets/bannermenino.png';
import bannerBebe from '../assets/bannerbebe.png';
import foto1 from '../assets/foto1.png';
import foto2 from '../assets/foto2.png';

export const Home: React.FC = () => {
  const [showFoto2, setShowFoto2] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFoto2(prev => !prev);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const featuredProducts = [
    {
      id: '1',
      name: 'Vestido Floral Rosa',
      price: 89.90,
      image: vestidoFloral,
      category: 'Menina'
    },
    {
      id: '2',
      name: 'Colete Azul Marinho',
      price: 69.90,
      image: colete,
      category: 'Menino'
    },
    {
      id: '3',
      name: 'Body Bebê Personagens',
      price: 39.90,
      image: bodybebe,
      category: 'Bebê'
    },
    {
      id: '4',
      name: 'Pijama Unicórnio',
      price: 59.90,
      image: pijama,
      category: 'Menina'
    }
  ];

  const categories = [
    {
      name: 'Bebê (0-2 anos)',
      image: bannerMenina,
      link: '/produtos?categoria=bebe'
    },
    {
      name: 'Menino (2-12 anos)',
      image: bannerMenino,
      link: '/produtos?categoria=menino'
    },
    {
      name: 'Menina (2-12 anos)',
      image: bannerBebe,
      link: '/produtos?categoria=menina'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Qualidade Garantida',
      description: 'Tecidos 100% algodão, seguros e confortáveis para a pele sensível dos pequenos.'
    },
    {
      icon: Truck,
      title: 'Entrega Rápida',
      description: 'Entregamos em todo o Brasil com rapidez e segurança. Frete grátis acima de R$ 150.'
    },
    {
      icon: HeartHandshake,
      title: 'Troca Garantida',
      description: 'Não ficou satisfeito? Trocamos ou devolvemos seu dinheiro em até 30 dias.'
    },
    {
      icon: Star,
      title: 'Avaliação 5 Estrelas',
      description: 'Milhares de famílias confiam em nossos produtos. Qualidade comprovada!'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
     <section
  className="relative bg-cover bg-center bg-no-repeat overflow-hidden min-h-[400px] sm:min-h-screen"
  style={{ backgroundImage: `url(${showFoto2 ? foto2 : foto1})` }}
>
 <div className="absolute inset-0 bg-white/50 sm:bg-white/50 lg:bg-transparent"></div>

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6 sm:space-y-8 text-center lg:text-left"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
          Roupas com
          <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            {' '}carinho{' '}
          </span>
          para seus
          <span className="bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent">
            {' '}pequenos
          </span>
        </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed">
          Descubra nossa coleção especial de roupas infantis, feitas com amor e qualidade 
          para acompanhar cada momento especial da infância dos seus filhos.
        </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
          <Link
            to="/produtos"
            className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-primary-400 to-secondary-400 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Ver Produtos
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            to="/sobre"
            className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-all duration-300"
          >
            Sobre Nós
          </Link>
        </div>
      </motion.div>
            
            <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative hidden lg:block"
      >
        <div className="relative">
          <img
            src="https://images.pexels.com/photos/8088195/pexels-photo-8088195.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Crianças felizes"
            className="rounded-3xl shadow-2xl w-full h-auto object-cover"
          />
          <div className="absolute -bottom-6 -left-10 bg-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-accent-400 to-primary-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-secondary-400 to-accent-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">+5.000 famílias</p>
                <p className="text-sm text-gray-600">confiam em nós</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Encontre o Tamanho Perfeito
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nossas roupas são organizadas por faixa etária para garantir o melhor ajuste e conforto
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={category.link}
                  className="group block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="aspect-square">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                      <div className="flex items-center text-white/80">
                        <span className="text-sm font-medium">Ver produtos</span>
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Selecionamos especialmente para você os produtos mais amados pelas famílias
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link
                  to={`/produto/${product.id}`}
                  className="block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-sm font-medium text-primary-600 mb-2 block">
                      {product.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/produtos"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-400 to-secondary-400 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Ver Todos os Produtos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Por que Escolher a Loja Mimos?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trabalhamos com dedicação para oferecer a melhor experiência para você e seu filho
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-400 to-secondary-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Pronto para Vestir Seus Pequenos com Carinho?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Cadastre-se e receba 10% de desconto na sua primeira compra. 
              Além de ficar por dentro das novidades e promoções exclusivas!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-6 py-4 rounded-xl border-0 focus:ring-4 focus:ring-white/20 focus:outline-none"
              />
              <button className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Cadastrar
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};