// /pages/page.tsx
import Link from 'next/link';

const Page = () => {
  return (
    <div
      className="dashboard_main min-h-screen flex flex-col items-center justify-between p-6"
      style={{ backgroundColor: "#E0F2FF" }} // Fundo azul claro
    >
      {/* Cabeçalho */}
      <header className="w-full max-w-4xl mb-12">
        <div className="flex justify-between items-center border-b border-gray-300 pb-6">
          <div className="flex items-center space-x-6">
            <img
              src="/TTT.svg"
              alt="Logo"
              className="w-20 h-20 object-contain"
            />
            <h1 className="text-4xl font-bold text-blue-900">
              Troca Troca Transações
            </h1>
          </div>
          <div className="text-gray-600 text-base">
            <p>Bem-vindo(a)</p>
            <p className="font-medium">Acesse suas opções abaixo</p>
          </div>
        </div>
      </header>

      {/* Camada branca ajustada: mais alta e menos larga */}
      <main className="flex flex-1 items-center justify-center w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col items-center gap-6">
          <Link href="/dashboard/receber">
            <button className="px-8 py-4 bg-green-700 text-white rounded-md shadow-md hover:bg-green-600 transition duration-300 w-full text-xl font-semibold">
              Receber
            </button>
          </Link>
          <Link href="/dashboard/depositar">
            <button className="px-8 py-4 bg-blue-700 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-300 w-full text-xl font-semibold">
              Depositar
            </button>
          </Link>
          <Link href="/dashboard/saldo">
            <button className="px-8 py-4 bg-purple-700 text-white rounded-md shadow-md hover:bg-purple-600 transition duration-300 w-full text-xl font-semibold">
              Saldo
            </button>
          </Link>
        </div>
      </main>

      {/* Rodapé com logo */}
      <footer className="fixed bottom-6 right-6">
        <img
          src="/TTT.svg"
          alt="Logo do Banco"
          className="w-64 h-64 object-contain opacity-90 hover:opacity-100 transition duration-300"
        />
      </footer>
    </div>
  );
};

export default Page;
