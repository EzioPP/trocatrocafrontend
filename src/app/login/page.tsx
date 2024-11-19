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
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 p-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
          <Image
            src="/logo.svg"
            width={38}
            height={38}
            alt={'logo'}
            className='mx-auto h-40 w-auto'
            priority={true}
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-light">
            Entre com sua conta
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="usuario" className="block text-sm/6 font-medium text-accent">
                Usuario
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  className="block w-full rounded-md border-0 py-1.5 text-accent bg-black shadow-sm ring-1 ring-inset ring-light placeholder:text-light focus:ring-2 focus:ring-inset focus:ring-light sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-accent ">
                  Senha
                </label>

              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-accent bg-black shadow-sm ring-1 ring-inset ring-light placeholder:text-light focus:ring-2 focus:ring-inset focus:ring-light sm:text-sm/6"
                />
              </div>
            </div>

            <div className="text-sm">
              <a href="/register"
                className="font-semibold text-lightAccent">
                Não tem uma conta? <span className="text-Accent">Registre-se</span>
              </a>

            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-black  px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-dark p-6 rounded-md shadow-md max-w-sm w-full">
            <p className="mt-4 text-center">

              {result === 500 && "Houve um erro no servidor."}
              {result === 404 && "Usuário não encontrado."}
              {result === 401 && "Senha inválida."}

            </p>
            <div className="mt-6 text-center">
              <button
                onClick={closeModal}
                className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-slate-800"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
