'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';

export default function ManageRelationships() {
  const [classes, setClasses] = useState([]); // Lista de classes disponíveis
  const [selectedClass, setSelectedClass] = useState(''); // Classe selecionada
  const [assets, setAssets] = useState([]); // Ativos da classe selecionada
  const [selectedAsset, setSelectedAsset] = useState(''); // Ativo selecionado
  const [relationships, setRelationships] = useState([]); // Relacionamentos do ativo selecionado
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [loadingRelationships, setLoadingRelationships] = useState(false);

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
        setLoadingAssets(true);
        try {
          const response = await axios.get(`http://localhost:3000/get_class/${selectedClass}`);
          setAssets(response.data);
        } catch (error) {
          alert('Erro ao carregar ativos: ' + error.message);
        } finally {
          setLoadingAssets(false);
        }
      }
    };

    fetchAssets();
  }, [selectedClass]);

  // Carrega todos os relacionamentos do ativo selecionado
  useEffect(() => {
    const fetchRelationships = async () => {
      if (selectedAsset) {
        setLoadingRelationships(true);
        try {
          const response = await axios.get(`http://localhost:3000/get_vinculos/${selectedAsset}`);
          setRelationships(response.data);
        } catch (error) {
          alert('Erro ao carregar relacionamentos: ' + error.message);
        } finally {
          setLoadingRelationships(false);
        }
      }
    };

    fetchRelationships();
  }, [selectedAsset]);

  // Excluir um relacionamento
  const deleteRelationship = async (origemId, destinoId, tipo) => {
    try {
      await axios.delete('http://localhost:3000/delete_vinculos', {
        data: { origemId, destinoId, tipo },
      });
      alert('Relacionamento excluído com sucesso!');
      setRelationships(
        relationships.filter(
          (rel) => !(rel.origemId === origemId && rel.destinoId === destinoId && rel.tipo === tipo)
        )
      );
    } catch (error) {
      alert('Erro ao excluir relacionamento: ' + error.message);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold text-black mb-6">Gerenciar Relacionamentos</h1>
        {/* Seleção da Classe */}
        <div className="mb-4">
          <label className="block text-black font-medium mb-2">Escolha uma Tabela:</label>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedAsset('');
              setRelationships([]);
            }}
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

        {/* Seleção do Ativo */}
        {selectedClass && (
          <div className="mb-4">
            <label className="block text-black font-medium mb-2">Escolha um Ativo:</label>
            {loadingAssets ? (
              <p className="text-black">Carregando ativos...</p>
            ) : (
              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Selecione um Ativo</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.identificador}>
                    {asset.identificador}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Lista de Relacionamentos */}
        {selectedAsset && (
          <div>
            <h2 className="text-lg font-semibold text-black mb-4">Relacionamentos de: {selectedAsset}</h2>
            {loadingRelationships ? (
              <p className="text-black">Carregando relacionamentos...</p>
            ) : relationships.length > 0 ? (
              <ul className="bg-white shadow-md rounded-lg p-4">
                {relationships.map((rel) => (
                  <li key={`${rel.origemId}-${rel.destinoId}-${rel.tipo}`} className="flex justify-between text-black items-center border-b last:border-none py-2">
                    <div>
                      <p className="text-black font-medium">Tipo: {rel.tipo}</p>
                      <p className="text-black text-sm">
                        Origem: {rel.origemId} | Destino: {rel.destinoId}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteRelationship(rel.origemId, rel.destinoId, rel.tipo)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Excluir
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-black">Nenhum relacionamento encontrado.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
