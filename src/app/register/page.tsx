'use client';
import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const Modal = ({ result, closeModal }: { result: number | null, closeModal: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <p className="mt-4 text-center text-gray-800">
        {result === 200 && "Usuário cadastrado com sucesso."}
        {result === 500 && "Houve um erro no servidor."}
        {result === 404 && "Usuário não encontrado."}
        {result === 401 && "Você não tem permissão para realizar esta ação."}
        {result === 409 && "Usuário já cadastrado."}
        {result === null && "Erro desconhecido."}
      </p>
      <div className="mt-6 text-center">
        <button
          onClick={closeModal}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
);

export default function Login() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const cpf = formData.get('cpf');
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const address = formData.get('address');
    const username = formData.get('username');
    const password = formData.get('password');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email as string)) {
      setShowModal(true);
      setResult(400); // Bad Request
      return;
    }

    const response = await fetch('http://localhost:5015/api/user/new-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client: { cpf, name, phone, email, address },
        user: { username, password }
      }),
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
      console.log('Login successful');
      router.push('/login');
    } else {
      setShowModal(true);
    }
  }

  const closeModal = () => setShowModal(false);
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 p-4 bg-blue-900"> {/* Alterei aqui para o fundo azul escuro */}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
          <Image
            src="/logo.svg"
            width={38}
            height={38}
            alt={'logo'}
            className='mx-auto h-20 w-auto'
            priority={true}
          />
          <h2 className="mt-8 text-3xl font-semibold text-white"> {/* Alterei a cor do texto para branco */}
            Os dados enseridos aqui será suas chaves pix2
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-8 py-6 space-y-6">
            <div>
              <label htmlFor="cpf" className="block text-lg font-medium text-gray-700"> {/* Aumentei o tamanho da fonte aqui */}
                CPF
              </label>
              <input
                id="cpf"
                name="cpf"
                type="text"
                required
                autoComplete="cpf"
                placeholder="000.000.000-00"
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700"> {/* Aumentei o tamanho da fonte aqui */}
                Nome Completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Seu nome completo"
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-lg font-medium text-gray-700"> {/* Aumentei o tamanho da fonte aqui */}
                Telefone
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                required
                autoComplete="phone"
                placeholder="(DDD) 00000-0000"
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700"> {/* Aumentei o tamanho da fonte aqui */}
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="seuemail@exemplo.com"
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-lg font-medium text-gray-700"> {/* Aumentei o tamanho da fonte aqui */}
                Endereço
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                autoComplete="address"
                placeholder="Rua, número, bairro"
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-lg font-medium text-gray-700"> {/* Aumentei o tamanho da fonte aqui */}
                Usuário
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                placeholder="Seu usuário"
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-medium text-gray-700"> {/* Aumentei o tamanho da fonte aqui */}
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="********"
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div className="text-sm">
              <a href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                Já tem uma conta? <span className="text-blue-700">Faça login</span>
              </a>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Criar Conta
              </button>
            </div>
          </form>
        </div>

        {showModal && <Modal result={result} closeModal={closeModal} />}
      </div>
    </>
  );
}
