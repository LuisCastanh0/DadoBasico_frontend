'use client';

import NavBar from './components/NavBar'; // Certifique-se de que o caminho está correto
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        {/* Seção de Apresentação */}
        <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8 text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Bem-vindo ao Dado Básico</h1>
          <p className="text-lg text-gray-700 mb-6">
            Um sistema simples e eficiente para gerenciar tabelas, linhas e relacionamentos de forma dinâmica.
          </p>

          {/* Links para funcionalidades principais */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link href="/create-table">
              <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md hover:bg-blue-600 transition cursor-pointer h-32 flex flex-col justify-center">
                <h2 className="text-xl font-semibold">Criar Tabela</h2>
                <p className="text-sm mt-2">Defina novas tabelas e configure seus campos.</p>
              </div>
            </Link>
            <Link href="/add-row">
              <div className="bg-green-500 text-white p-6 rounded-lg shadow-md hover:bg-green-600 transition cursor-pointer h-32 flex flex-col justify-center">
                <h2 className="text-xl font-semibold">Adicionar Linha</h2>
                <p className="text-sm mt-2">Adicione registros em suas tabelas existentes.</p>
              </div>
            </Link>
            <Link href="/create-relationship">
              <div className="bg-purple-500 text-white p-6 rounded-lg shadow-md hover:bg-purple-600 transition cursor-pointer h-32 flex flex-col justify-center">
                <h2 className="text-xl font-semibold">Criar Relacionamento</h2>
                <p className="text-sm mt-2">Estabeleça conexões entre diferentes registros.</p>
              </div>
            </Link>
            <Link href="/manage-tables">
              <div className="bg-indigo-500 text-white p-6 rounded-lg shadow-md hover:bg-indigo-600 transition cursor-pointer h-32 flex flex-col justify-center">
                <h2 className="text-xl font-semibold">Gerenciar Tabelas</h2>
                <p className="text-sm mt-2">Visualize e exclua tabelas existentes.</p>
              </div>
            </Link>
            <Link href="/manage-ativos">
              <div className="bg-orange-500 text-white p-6 rounded-lg shadow-md hover:bg-orange-600 transition cursor-pointer h-32 flex flex-col justify-center">
                <h2 className="text-xl font-semibold">Consultar Tabela</h2>
                <p className="text-sm mt-2">Explore os registros de cada tabela criada.</p>
              </div>
            </Link>
            <Link href="/manage-relationships">
              <div className="bg-red-500 text-white p-6 rounded-lg shadow-md hover:bg-red-600 transition cursor-pointer h-32 flex flex-col justify-center">
                <h2 className="text-xl font-semibold">Gerenciar Relacionamentos</h2>
                <p className="text-sm mt-2">Visualize e exclua relacionamentos entre registros.</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Rodapé */}
        <footer className="mt-12 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Dado Básico. Todos os direitos reservados.</p>
        </footer>
      </div>
    </>
  );
}
