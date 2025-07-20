import React from 'react';
import { motion } from 'framer-motion';
import quemSomos from '../assets/quemsomos.png'

export const Sobre: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center"
      >
        {/* Imagem */}
       <div>
       <img
    src={quemSomos}
    alt="Criança felize"
     className="w-80 rounded-2xl shadow-lg"
  />
      </div>


        {/* Texto */}
        <div className="text-gray-800">
          <h1 className="text-4xl font-extrabold mb-6 text-pink-600">Sobre a  Mimos</h1>
          <p className="text-lg mb-4">
            A <span className="font-semibold text-purple-700">A loja  Mimos</span> nasceu com o propósito de oferecer roupas infantis com qualidade, conforto e muito carinho.
          </p>
          <p className="text-lg mb-4">
            Cada peça é escolhida com amor, pensando nos momentos únicos da infância — desde os primeiros passos até as grandes aventuras dos pequenos.
          </p>
          <p className="text-lg mb-4">
            Trabalhamos com tecidos seguros, atendimento acolhedor e entregas ágeis para todo o Brasil. Nosso compromisso é com a felicidade da sua família.
          </p>
          <p className="text-lg font-semibold text-pink-700">Obrigado por fazer parte da nossa história 💖</p>
        </div>
      </motion.div>
    </div>
  );
};
