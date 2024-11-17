'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';

export default function ManageAssets() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [assets, setAssets] = useState([]);
  const [attributeKeys, setAttributeKeys] = useState([]); // Chaves dos atributos para criar as colunas
  const [editData, setEditData] = useState(null); // Dados do ativo que está sendo editado

  // Carrega todas as tabelas
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

  // Carrega todos os ativos da classe selecionada
  useEffect(() => {
    const fetchAssets = async () => {
      if (selectedClass) {
        try {
          const response = await axios.get(`http://localhost:3000/get_class/${selectedClass}`);
          setAssets(response.data);

          // Extrair as chaves dos atributos para criar as colunas, exceto o identificador
          if (response.data.length > 0) {
            const keys = Object.keys(response.data[0].atributos || {}).filter(
              (key) => key.toLowerCase() !== 'identificador'
            );
            setAttributeKeys(keys);
          } else {
            setAttributeKeys([]);
          }
        } catch (error) {
          alert('Erro ao carregar ativos: ' + error.message);
        }
      }
    };

    fetchAssets();
  }, [selectedClass]);

  // Excluir um ativo
  const deleteAsset = async (identificador) => {
    try {
      await axios.delete(`http://localhost:3000/delete_ativo/${identificador}`);
      alert(`Ativo '${identificador}' excluído com sucesso!`);
      setAssets(assets.filter((asset) => asset.identificador !== identificador));
    } catch (error) {
      alert('Erro ao excluir ativo: ' + error.message);
    }
  };

  // Abrir modal de edição
  const handleEdit = (asset) => {
    setEditData({ ...asset, atributos: { ...asset.atributos } }); // Clona os dados do ativo
  };

  // Atualizar os dados de edição no modal
  const handleEditChange = (key, value) => {
    setEditData((prev) => ({
      ...prev,
      atributos: {
        ...prev.atributos,
        [key]: value,
      },
    }));
  };

  // Salvar alterações do modal
  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:3000/update_ativo`, {
        identificador: editData.identificador,
        atributos: editData.atributos,
      });
      alert(`Ativo '${editData.identificador}' atualizado com sucesso!`);

      // Atualizar lista de ativos
      setAssets((prev) =>
        prev.map((asset) =>
          asset.identificador === editData.identificador ? editData : asset
        )
      );
      setEditData(null); // Fecha o modal
    } catch (error) {
      alert('Erro ao atualizar ativo: ' + error.message);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold text-black mb-6">Gerenciar Ativos</h1>
        {/* Seleção da Classe */}
        <div className="mb-4">
          <label className="block text-black font-medium mb-2">Escolha uma Tabela:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Selecione uma Classe</option>
            {classes.map((classe) => (
              <option key={classe.id} value={classe.identificador}>
                {classe.identificador}
              </option>
            ))}
          </select>
        </div>

        {/* Tabela de Ativos */}
        {selectedClass && (
          <div className="bg-white text-black shadow-md rounded-lg p-4">
            {assets.length > 0 ? (
              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2 text-left">Identificador</th>
                    {attributeKeys.map((key) => (
                      <th key={key} className="border px-4 py-2 text-left">
                        {key}
                      </th>
                    ))}
                    <th className="border px-4 py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr key={asset.id} className="border-b">
                      <td className="border px-4 py-2 text-black">{asset.identificador}</td>
                      {attributeKeys.map((key) => (
                        <td key={key} className="border px-4 py-2 text-black">
                          {asset.atributos[key] || ''}
                        </td>
                      ))}
                      <td className="border px-4 py-2 text-center">
                        <button
                          onClick={() => handleEdit(asset)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteAsset(asset.identificador)}
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-black">Nenhum ativo encontrado nesta tabela.</p>
            )}
          </div>
        )}

        {/* Modal de Edição */}
        {editData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold text-black mb-4">Editar Ativo</h2>
              <p className="mb-4 text-black">
                Identificador: <strong>{editData.identificador}</strong>
              </p>
              {attributeKeys.map((key) => (
                <div key={key} className="mb-4">
                  <label className="block text-black font-medium mb-2">{key}:</label>
                  <input
                    type="text"
                    value={editData.atributos[key] || ''}
                    onChange={(e) => handleEditChange(key, e.target.value)}
                    className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  onClick={() => setEditData(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
