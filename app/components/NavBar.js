import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-lg font-bold">
          <Link href="/">Dado Básico</Link>
        </div>

        {/* Links */}
        <div className="justify-center w-full flex space-x-12">
          <Link href="/create-table" className="hover:text-gray-200">
            Criar Tabela
          </Link>
          <Link href="/add-row" className="hover:text-gray-200">
            Adicionar Linha
          </Link>
          <Link href="/create-relationship" className="hover:text-gray-200">
            Criar Relacionamento
          </Link>
          <Link href="/manage-tables" className="hover:text-gray-200">
            Gerenciar Tabelas
          </Link>
          <Link href="/manage-ativos" className="hover:text-gray-200">
            Consultar Tabela 
          </Link>
          <Link href="/manage-relationships" className="hover:text-gray-200">
            Gerenciar Relacionamentos
          </Link>
        </div>
      </div>
    </nav>
  );
}
