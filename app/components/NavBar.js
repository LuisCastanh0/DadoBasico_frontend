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
        <div className="flex space-x-16">
          <Link href="/create-table">Criar Tabela</Link>
          <Link href="/add-row">Adicionar Linha</Link>
          <Link href="/create-relationship">Criar Relacionamento</Link>
        </div>
      </div>
    </nav>
  );
}