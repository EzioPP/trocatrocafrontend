'use client';
import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const Modal = ({ result, closeModal }: { result: number | null, closeModal: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-dark p-6 rounded-md shadow-md max-w-sm w-full">
            <p className="mt-4 text-center">
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
                    className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-slate-800"
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
                        Crie sua conta
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="cpf" className="block text-sm/6 font-medium text-accent">
                                CPF
                            </label>
                            <div className="mt-2">
                                <input
                                    id="cpf"
                                    name="cpf"
                                    type="text"
                                    required
                                    autoComplete="cpf"
                                    className="block w-full rounded-md border-0 py-1.5 text-accent bg-black shadow-sm ring-1 ring-inset ring-light placeholder:text-light focus:ring-2 focus:ring-inset focus:ring-light sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm/6 font-medium text-accent">
                                Nome
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    autoComplete="name"
                                    className="block w-full rounded-md border-0 py-1.5 text-accent bg-black shadow-sm ring-1 ring-inset ring-light placeholder:text-light focus:ring-2 focus:ring-inset focus:ring-light sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm/6 font-medium text-accent">
                                Telefone
                            </label>
                            <div className="mt-2">
                                <input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    required
                                    autoComplete="phone"
                                    className="block w-full rounded-md border-0 py-1.5 text-accent bg-black shadow-sm ring-1 ring-inset ring-light placeholder:text-light focus:ring-2 focus:ring-inset focus:ring-light sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-accent">
                                Email
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 py-1.5 text-accent bg-black shadow-sm ring-1 ring-inset ring-light placeholder:text-light focus:ring-2 focus:ring-inset focus:ring-light sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm/6 font-medium text-accent">
                                Endereço
                            </label>
                            <div className="mt-2">
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    required
                                    autoComplete="address"
                                    className="block w-full rounded-md border-0 py-1.5 text-accent bg-black shadow-sm ring-1 ring-inset ring-light placeholder:text-light focus:ring-2 focus:ring-inset focus:ring-light sm:text-sm/6"
                                />
                            </div>
                        </div>


                        <div>
                            <label htmlFor="username" className="block text-sm/6 font-medium text-accent">
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
                            <a href="/login"
                                className="font-semibold text-lightAccent">

                                Já tem uma conta? <span className="text-Accent">Faça login</span>

                            </a>

                        </div>
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-slate-800"
                            >
                                Criar Conta
                            </button>
                        </div>
                    </form>

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
            </div>
            {showModal && <Modal result={result} closeModal={closeModal} />}
        </>
    );
}