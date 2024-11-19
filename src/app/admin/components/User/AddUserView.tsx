'use client';
import { useState } from "react";

type AddUserViewProps = {
    sendShowComponent: (showComponent: string) => void;
};

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

export default function AddUserView({ sendShowComponent }: AddUserViewProps) {

    const [selectedOption, setSelectedOption] = useState<'id' | 'none'>('id');
    const [showModal, setShowModal] = useState(false);
    const [showComponent, setShowComponent] = useState<string>("none");
    const [result, setResult] = useState<number | null>(null);

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value as 'id' | 'none');
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {

            const formData = new FormData(event.currentTarget);
            const username = formData.get('username');
            const password = formData.get('password');
            const permissions = formData.get('permissions');
            const searchOption = formData.get('searchOption');
            const clientId = formData.get('search')
            console.log(JSON.stringify({ username, password, permissions, clientId }));
            const body = searchOption === 'id' ? { username, password, permissions, clientId } : { username, password, permissions };

            const response = await fetch('http://localhost:5015/api/user/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                credentials: 'include',
            });


            setShowModal(true);
            setResult(response.status);

        } catch (error) {
            console.error(error);
            setShowModal(true);
            setResult(500);
        }
    };

    const closeModal = () => setShowModal(false);

    const handleShowComponent = () => {
        setShowComponent("none");
        sendShowComponent(showComponent);
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center bg-dark text-light">
                <div className="w-full max-w-md">
                    <form className="bg-semiDark shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-lightAccent text-sm font-bold mb-2" htmlFor="username">
                                Nome de usuário
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
                                id="username"
                                type="text"
                                placeholder="Nome de usuário"
                                name="username"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-lightAccent text-sm font-bold mb-2" htmlFor="password">
                                Senha
                            </label>
                            <input
                                className="shadow appearance-none border border-lightAccent rounded w-full py-2 px-3 text-dark mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="******************"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-lightAccent text-sm font-bold mb-2" htmlFor="permissions">
                                Permissões
                            </label>
                            <select
                                className="shadow appearance-none border border-lightAccent rounded w-full py-2 px-3 text-dark mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="permissions"
                                name="permissions"
                                required
                            >
                                <option value="admin">Administrador</option>
                                <option value="moderator">Moderador</option>
                                <option value="user">Usuário</option>
                            </select>
                        </div>
                        <div className="mb-6">
                            <label className="block text-lightAccent text-sm font-bold mb-2">
                                Adicionar usuário
                            </label>
                            <div className="flex items-center">
                                <input
                                    className="mr-2 leading-tight"
                                    type="radio"
                                    id="id"
                                    name="searchOption"
                                    value="id"
                                    checked={selectedOption === 'id'}
                                    onChange={handleOptionChange}
                                />
                                <label className="text-lightAccent" htmlFor="id">
                                    Por ID ou Email
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    className="mr-2 leading-tight"
                                    type="radio"
                                    id="none"
                                    name="searchOption"
                                    value="none"
                                    checked={selectedOption === 'none'}
                                    onChange={handleOptionChange}
                                />
                                <label className="text-lightAccent" htmlFor="none">
                                    Nenhum
                                </label>
                            </div>
                            {selectedOption !== 'none' && (
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
                                    id="search"
                                    name="search"
                                    type="text"
                                    placeholder="Digite o ID ou Email"
                                    required
                                />
                            )}
                        </div>
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <button
                                    className="bg-accent hover:bg-lightAccent text-dark font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Cadastrar
                                </button>
                                <button
                                    className="bg-rose-800 hover:bg-rose-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={handleShowComponent}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {showModal && <Modal result={result} closeModal={closeModal} />}
        </>
    );
}
