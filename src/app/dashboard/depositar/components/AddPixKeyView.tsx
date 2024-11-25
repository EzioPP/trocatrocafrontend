'use client';

import { useEffect, useState } from "react";
import { ClientProps, PixProps } from "../local-constants";

type TrasactionViewProps = {
    sendShowComponent: (showComponent: string) => void;
};

const Modal = ({ result, closeModal }: { result: string | null, closeModal: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-dark p-6 rounded-md shadow-md max-w-sm w-full">
            <p className="mt-4 text-center">
                {result}
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

async function getClientPixableKeys(): Promise<ClientProps> {
    const response = await fetch('http://localhost:5015/api/client/client', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });

    if (response.ok) {
        const client = await response.json();
        console.log(client);
        return client as ClientProps;
    } else {
        throw new Error('Failed to fetch balance');
    }
}
async function getPix(): Promise<PixProps[]> {
    const response = await fetch('http://localhost:5015/api/pix/client', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (response.ok) {
        const pix = await response.json();
        console.log(pix);
        return pix as PixProps[];
    } else {
        throw new Error('Failed to fetch balance');
    }
}


export default function CardView({ sendShowComponent }: TrasactionViewProps) {
    const [showComponent, setShowComponent] = useState<string>("none");
    const [showModal, setShowModal] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [client, setClient] = useState<ClientProps | null>(null);
    const [pix, setPix] = useState<PixProps[]>([]);


    const handleShowComponent = () => {
        setShowComponent("none");
        sendShowComponent(showComponent);
    };

    useEffect(() => {
        const fetchData = async () => {
            const client = await getClientPixableKeys();
            const pix = await getPix();
            setPix(pix);
            setClient(client);
            console.log(client);
            console.log(pix);
        };
        fetchData();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);
            const keyType = formData.get('keyType');
            if (pix.some(p => p._keyType === keyType)) {
                setShowModal(true);
                setResult("Tipo de chave já cadastrado");
                return;
            }
            const response = await fetch('http://localhost:5015/api/pix/client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyType }),
                credentials: 'include',
            });
            console.log(response);
            setShowModal(true);
            if (response.ok) {
                setResult("Tipo de chave cadastrado com sucesso");
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
            else {
                setResult("Falha ao cadastrar tipo de chave");
            }


        } catch (error) {

            console.error(error);
        }
    };
    const remove = async () => {
        try {
            const keyType = (document.querySelector('select[name="keyType"]') as HTMLSelectElement).value;
            console.log("Removing key of type: ", keyType);
            const response = await fetch(`http://localhost:5015/api/pix/client/${keyType}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            console.log(response);
            setShowModal(true);
            if (response.ok) {
                setResult("Tipo de chave removido com sucesso");
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                setResult("Falha ao remover tipo de chave");
            }
        } catch (error) {
            console.error(error);
            setShowModal(true);
            setResult("500");
        }
    };

    console.log()
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <form onSubmit={handleSubmit} className="bg-dark p-4 rounded-lg">
                <div className="flex flex-col mb-4">
                    <label className="text-lightAccent text-sm" htmlFor="cardNumber">
                        Tipo de chave
                    </label>
                    <div className="flex flex-col space-y-2">
                        <div className="flex flex-col mb-4">
                            <select name="keyType" className="mt-2 p-2 bg-dark text-white rounded-md">
                                <option value="CPF">CPF</option>
                                <option value="Email">Email</option>
                                <option value="Telefone">Telefone</option>
                            </select>
                        </div>
                    </div>

                </div >
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
                        onClick={() => remove()}
                    >
                        Remover
                    </button>
                    <button
                        className="bg-rose-800 hover:bg-rose-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={handleShowComponent}
                    >
                        Cancelar
                    </button>
                </div>
            </form >
            {showModal && <Modal result={result} closeModal={() => setShowModal(false)} />
            }

        </div >
    );
}