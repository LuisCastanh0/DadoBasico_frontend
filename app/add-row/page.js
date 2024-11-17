'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar'; // Certifique-se de que o caminho está correto

export default function AddRow() {
  const [classes, setClasses] = useState([]); // Lista de classes disponíveis
  const [selectedClass, setSelectedClass] = useState(''); // Classe selecionada
  const [attributes, setAttributes] = useState({}); // Atributos da classe
  const [rowData, setRowData] = useState({}); // Dados para criar a linha
  const [loading, setLoading] = useState(false);

  // Busca todas as classes disponíveis ao carregar a página
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/get_class');
        setClasses(response.data);
      } catch (error) {
        alert('Erro ao carregar classes: ' + error.message);
      }
    };

    fetchClasses();
  }, []);

  // Atualiza os atributos quando uma classe é selecionada
  useEffect(() => {
    const fetchAttributes = async () => {
      if (selectedClass) {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:3000/get_class_attributes/${selectedClass}`);
          setAttributes(response.data);
          setRowData(
            Object.keys(response.data).reduce((acc, key) => {
              acc[key] = ''; // Inicializa os campos vazios
              return acc;
            }, { identificador: '' }) // Adiciona o campo identificador
          );
        } catch (error) {
          alert('Erro ao carregar atributos: ' + error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAttributes();
  }, [selectedClass]);

  // Envia os dados para criar a linha
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rowData.identificador) {
      alert('Por favor, defina um identificador único para o ativo.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/create_ativo', {
        classeId: selectedClass,
        identificador: rowData.identificador,
        atributos: rowData,
      });
      alert('Linha adicionada com sucesso!');
      console.log(response.data);
      setSelectedClass('');
      setAttributes({});
      setRowData({});
    } catch (error) {
      alert('Erro ao adicionar linha: ' + error.message);
    }
  };

  return (
    <>
      <NavBar /> {/* Adicionada a NavBar */}
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <div className="bg-white shadow-md rounded-lg w-full max-w-3xl p-8">
          <h1 className="text-2xl font-bold text-black mb-6">Adicionar Linha na Tabela</h1>

          {/* Seleção da Classe */}
          <div className="mb-6">
            <label className="block text-black font-medium mb-2">Escolha a Tabela (Classe):</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Selecione uma Classe</option>
              {classes.map((classe) => (
                <option key={classe.id} value={classe.identificador}>
                  {classe.identificador}
                </option>
              ))}
            </select>
          </div>

          {/* Formulário para os Atributos */}
          {selectedClass && (
            <>
              <h2 className="text-lg font-semibold text-black mb-4">
                Preencha os Campos para a Tabela: {selectedClass}
              </h2>

              {loading ? (
                <p className="text-black">Carregando atributos...</p>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Identificador */}
                  <div className="mb-4">
                    <label className="block text-black font-medium mb-2">Identificador Único:</label>
                    <input
                      type="text"
                      value={rowData.identificador || ''}
                      onChange={(e) =>
                        setRowData({ ...rowData, identificador: e.target.value })
                      }
                      className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Digite o identificador único (ex.: Cliente123)"
                      required
                    />
                  </div>

                  {/* Campos Dinâmicos */}
                  {Object.entries(attributes).map(([key, type]) => (
                    <div key={key} className="mb-4">
                      <label className="block text-black font-medium mb-2">{key} ({type}):</label>
                      <input
                        type="text"
                        value={rowData[key] || ''}
                        onChange={(e) =>
                          setRowData({ ...rowData, [key]: e.target.value })
                        }
                        className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder={`Digite o valor para ${key}`}
                        required
                      />
                    </div>
                  ))}

                  {/* Botão de Submissão */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium"
                  >
                    Adicionar Linha
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
