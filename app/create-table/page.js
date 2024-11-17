'use client';

import { useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';

export default function CreateTable() {
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState([]);
  const [columnName, setColumnName] = useState('');
  const [columnType, setColumnType] = useState('');

  const handleAddColumn = () => {
    if (columnName && columnType) {
      setColumns([...columns, { name: columnName, type: columnType }]);
      setColumnName('');
      setColumnType('');
    } else {
      alert('Por favor, defina o nome e o tipo da coluna.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tableName) {
      alert('Por favor, defina o nome da tabela.');
      return;
    }
    if (columns.length === 0) {
      alert('Por favor, adicione pelo menos uma coluna.');
      return;
    }

    const atributos = columns.reduce((acc, column) => {
      acc[column.name] = column.type;
      return acc;
    }, {});

    try {
      const response = await axios.post('http://localhost:3000/create_class', {
        identificador: tableName,
        atributos,
      });
      alert('Tabela criada com sucesso!');
      console.log(response.data);
      setTableName('');
      setColumns([]);
    } catch (error) {
      alert('Erro ao criar tabela: ' + error.message);
    }
  };

  return (
    <>
      <NavBar /> {/* Adicionada a NavBar */}
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <div className="bg-white shadow-md rounded-lg w-full max-w-3xl p-8">
          <h1 className="text-2xl font-bold text-black mb-6">Criar Tabela (Classe)</h1>

          <form onSubmit={handleSubmit}>
            {/* Nome da Tabela */}
            <div className="mb-4">
              <label className="block text-black font-medium mb-2">Nome da Tabela:</label>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Exemplo: Clientes"
                required
              />
            </div>

            {/* Adicionar Colunas */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-black mb-4">Adicionar Colunas:</h2>

              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  value={columnName}
                  onChange={(e) => setColumnName(e.target.value)}
                  className="flex-1 px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Nome da Coluna"
                />
                <select
                  value={columnType}
                  onChange={(e) => setColumnType(e.target.value)}
                  className="px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Tipo</option>
                  <option value="string">Texto</option>
                  <option value="int">Número Inteiro</option>
                  <option value="float">Número Decimal</option>
                  <option value="boolean">Booleano</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddColumn}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Adicionar
                </button>
              </div>

              {/* Lista de Colunas */}
              {columns.length > 0 && (
                <ul className="bg-gray-100 rounded-md p-4">
                  {columns.map((col, index) => (
                    <li key={index} className="flex justify-between items-center mb-2">
                      <span className="font-medium text-black">{col.name}</span>
                      <span className="text-black">{col.type}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Botão de Submissão */}
            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium"
            >
              Criar Tabela
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
