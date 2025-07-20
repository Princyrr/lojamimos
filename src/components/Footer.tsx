import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import pixImg from '../assets/pix.png'
import mercadoPagoImg from '../assets/mercadopago.png'
import pagseguroImg from '../assets/pagseguro.png'


export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Loja Mimos</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Roupas infantis com carinho, qualidade e estilo para seus pequenos. 
              Transformamos momentos especiais em memórias inesquecíveis.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/produtos" className="text-gray-300 hover:text-white transition-colors">
                  Todos os Produtos
                </Link>
              </li>
              <li>
                <Link to="/produtos?categoria=bebe" className="text-gray-300 hover:text-white transition-colors">
                  Roupas para Bebê
                </Link>
              </li>
              <li>
                <Link to="/produtos?categoria=menino" className="text-gray-300 hover:text-white transition-colors">
                  Roupas para Menino
                </Link>
              </li>
              <li>
                <Link to="/produtos?categoria=menina" className="text-gray-300 hover:text-white transition-colors">
                  Roupas para Menina
                </Link>
              </li>
              <li>
                <Link to="/ofertas" className="text-gray-300 hover:text-white transition-colors">
                  Ofertas Especiais
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Atendimento</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/como-comprar" className="text-gray-300 hover:text-white transition-colors">
                  Como Comprar
                </Link>
              </li>
              <li>
                <Link to="/entregas" className="text-gray-300 hover:text-white transition-colors">
                  Entregas
                </Link>
              </li>
              <li>
                <Link to="/trocas-devolucoes" className="text-gray-300 hover:text-white transition-colors">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link to="/politica-privacidade" className="text-gray-300 hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos-uso" className="text-gray-300 hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <p>Avenida conselheiro rosa e silva</p>
                  <p>Graças, Recife - PE</p>
                  <p>CEP: 52020-220</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">(81) 98811-5840</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">Princyrpiress@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Loja Mimos. Feito por Priscila Ramonna com Todos os direitos reservados.
            </p>
           <div className="flex space-x-6 mt-4 md:mt-0">
  <img src={pixImg} alt="PIX" className="h-6" />
  <img src={mercadoPagoImg} alt="Mercado Pago" className="h-6" />
  <img src={pagseguroImg} alt="PagSeguro" className="h-6" />
</div>

          </div>
        </div>
      </div>
    </footer>
  );
};