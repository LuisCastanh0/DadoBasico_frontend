'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CreateRelationship() {
  const [classes, setClasses] = useState([]); // Lista de classes disponíveis
  const [originClass, setOriginClass] = useState(''); // Classe do ativo de origem
  const [originAssets, setOriginAssets] = useState([]); // Ativos da classe de origem
  const [originAsset, setOriginAsset] = useState(''); // Ativo de origem
  const [destinationClass, setDestinationClass] = useState(''); // Classe do ativo de destino
  const [destinationAssets, setDestinationAssets] = useState([]); // Ativos da classe de destino
  const [destinationAsset, setDestinationAsset] = useState(''); // Ativo de destino
  const [relationshipType, setRelationshipType] = useState(''); // Tipo do relacionamento
  const [loadingOriginAssets, setLoadingOriginAssets] = useState(false);
  const [loadingDestinationAssets, setLoadingDestinationAssets] = useState(false);

  // Carrega todas as classes ao carregar a página
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

  // Carrega os ativos de origem quando a classe de origem é selecionada
  useEffect(() => {
    const fetchOriginAssets = async () => {
      if (originClass) {
        setLoadingOriginAssets(true);
        try {
          const response = await axios.get(`http://localhost:3000/get_class/${originClass}`);
          setOriginAssets(response.data);
        } catch (error) {
          alert('Erro ao carregar ativos de origem: ' + error.message);
        } finally {
          setLoadingOriginAssets(false);
        }
      }
    };

    fetchOriginAssets();
  }, [originClass]);

  // Carrega os ativos de destino quando a classe de destino é selecionada
  useEffect(() => {
    const fetchDestinationAssets = async () => {
      if (destinationClass) {
        setLoadingDestinationAssets(true);
        try {
          const response = await axios.get(`http://localhost:3000/get_class/${destinationClass}`);
          setDestinationAssets(response.data);
        } catch (error) {
          alert('Erro ao carregar ativos de destino: ' + error.message);
        } finally {
          setLoadingDestinationAssets(false);
        }
      }
    };

    fetchDestinationAssets();
  }, [destinationClass]);

  // Envia os dados para criar o vínculo
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originAsset || !destinationAsset || !relationshipType) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/create_vinculo', {
        origemId: originAsset,
        destinoId: destinationAsset,
        tipo: relationshipType,
      });
      alert('Vínculo criado com sucesso!');
      console.log(response.data);
      setOriginClass('');
      setOriginAssets([]);
      setOriginAsset('');
      setDestinationClass('');
      setDestinationAssets([]);
      setDestinationAsset('');
      setRelationshipType('');
    } catch (error) {
      alert('Erro ao criar vínculo: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="bg-white shadow-md rounded-lg w-full max-w-3xl p-8">
        <h1 className="text-2xl font-bold text-black mb-6">Criar Relacionamento entre Ativos</h1>

        <form onSubmit={handleSubmit}>
          {/* Seleção da Classe e Ativo de Origem */}
          <div className="mb-6">
            <label className="block text-black font-medium mb-2">Escolha a Classe do Ativo de Origem:</label>
            <select
              value={originClass}
              onChange={(e) => setOriginClass(e.target.value)}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Selecione uma Classe</option>
              {classes.map((classe) => (
                <option key={classe.id} value={classe.identificador}>
                  {classe.identificador}
                </option>
              ))}
            </select>

            {loadingOriginAssets ? (
              <p className="text-black mt-2">Carregando ativos de origem...</p>
            ) : (
              originAssets.length > 0 && (
                <div className="mt-4">
                  <label className="block text-black font-medium mb-2">Escolha o Ativo de Origem:</label>
                  <select
                    value={originAsset}
                    onChange={(e) => setOriginAsset(e.target.value)}
                    className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Selecione um Ativo</option>
                    {originAssets.map((asset) => (
                      <option key={asset.id} value={asset.identificador}>
                        {asset.identificador}
                      </option>
                    ))}
                  </select>
                </div>
              )
            )}
          </div>

          {/* Tipo de Relacionamento */}
          <div className="mb-6">
            <label className="block text-black font-medium mb-2">Tipo de Relacionamento:</label>
            <input
              type="text"
              value={relationshipType}
              onChange={(e) => setRelationshipType(e.target.value)}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ex.: Possui, Relacionado a..."
              required
            />
          </div>

          {/* Seleção da Classe e Ativo de Destino */}
          <div className="mb-6">
            <label className="block text-black font-medium mb-2">Escolha a Classe do Ativo de Destino:</label>
            <select
              value={destinationClass}
              onChange={(e) => setDestinationClass(e.target.value)}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Selecione uma Classe</option>
              {classes.map((classe) => (
                <option key={classe.id} value={classe.identificador}>
                  {classe.identificador}
                </option>
              ))}
            </select>

            {loadingDestinationAssets ? (
              <p className="text-black mt-2">Carregando ativos de destino...</p>
            ) : (
              destinationAssets.length > 0 && (
                <div className="mt-4">
                  <label className="block text-black font-medium mb-2">Escolha o Ativo de Destino:</label>
                  <select
                    value={destinationAsset}
                    onChange={(e) => setDestinationAsset(e.target.value)}
                    className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Selecione um Ativo</option>
                    {destinationAssets.map((asset) => (
                      <option key={asset.id} value={asset.identificador}>
                        {asset.identificador}
                      </option>
                    ))}
                  </select>
                </div>
              )
            )}
          </div>

          {/* Botão de Submissão */}
          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium"
          >
            Criar Relacionamento
          </button>
        </form>
      </div>
    </div>
  );
}
