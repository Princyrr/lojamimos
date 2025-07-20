import React from 'react';
import { motion } from 'framer-motion';

export const Contato: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
          Entre em Contato
        </h1>

        <p className="text-center text-gray-600 mb-10 text-base md:text-lg">
          Tem alguma dúvida, sugestão ou precisa de ajuda? Preencha o formulário abaixo e retornaremos o mais rápido possível.
        </p>

        <form className="space-y-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700">
              Mensagem
            </label>
            <textarea
              id="mensagem"
              name="mensagem"
              rows={5}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
              required
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-400 to-secondary-400 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
            >
              Enviar mensagem
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
