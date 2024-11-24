'use client';
import Image from 'next/image';
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username');
    const password = formData.get('password');

    const response = await fetch('http://localhost:5015/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    if (response.status === 401) {
      setShowModal(true);
      setResult(401); // Unauthorized
    } else if (response.status === 500) {
      setShowModal(true);
      setResult(500); // Internal Server Error
    } else if (response.status === 404) {
      setShowModal(true);
      setResult(404); // User not found
    } else if (response.ok) {
      // If login is successful, redirect to another page (e.g., dashboard)
      console.log('Login successful');
      router.push('/dashboard'); // Or the appropriate page after login
    } else {
      setShowModal(true); // Show modal for any other error
    }
  }

  const closeModal = () => setShowModal(false);
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-900"> {/* Alterei para o fundo azul escuro */}
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <Image
              src="/logo1.svg" // Altere para o logo do banco
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto"
              priority={true}
            />
            <h2 className="text-2xl font-semibold text-black mt-4"> {/* Altere para texto preto */}
              Acesse sua Conta Bancária
            </h2>
            <p className="text-black text-sm">Gerencie suas finanças de forma segura</p> {/* Altere para texto preto */}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label htmlFor="username" className="block text-lg font-medium text-black">
                Usuário
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                className="mt-1 block w-full border-black-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>

            <div>
            <label htmlFor="username" className="block text-lg font-medium text-black">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
               className="mt-1 block w-full border-black-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>

            <div className="flex items-center justify-between">
              <a
                href="/register"
                className="text-sm text-blue-500 hover:underline"
              >
                Não tem uma conta? Registre-se
              </a>
              <a
                href="/forgot-password"
                className="text-sm text-blue-500 hover:underline"
              >
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <p className="text-center text-black"> {/* Alterei para texto preto */}
              {result === 500 && 'Erro no servidor. Tente novamente mais tarde.'}
              {result === 404 && 'Usuário não encontrado.'}
              {result === 401 && 'Credenciais inválidas. Tente novamente.'}
            </p>
            <div className="mt-6 text-center">
              <button
                onClick={closeModal}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
