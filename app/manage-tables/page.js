'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';

export default function ManageTables() {
  const [tables, setTables] = useState([]);

  // Carrega todas as tabelas
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('http://localhost:3000/get_class');
        setTables(response.data);
      } catch (error) {
        alert('Erro ao carregar tabelas: ' + error.message);
      }
    };

    fetchTables();
  }, []);

  // Excluir uma tabela
  const deleteTable = async (identificador) => {
    try {
      await axios.delete(`http://localhost:3000/delete_class/${identificador}`);
      alert(`Tabela '${identificador}' excluída com sucesso!`);
      setTables(tables.filter((table) => table.identificador !== identificador));
    } catch (error) {
      alert('Erro ao excluir tabela: ' + error.message);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold text-black mb-6">Gerenciar Tabelas</h1>
        <ul className="bg-white shadow-md rounded-lg p-4">
          {tables.map((table) => (
            <li key={table.id} className="flex justify-between items-center border-b last:border-none py-2">
              <span className="text-black">{table.identificador}</span>
              <button
                onClick={() => deleteTable(table.identificador)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
