'use client';

import { useEffect, useState } from "react";
import { ClientProps, PixProps } from "../local-constants";
import CurrencyInput from "@/global-components/CurrencyInput";
type TrasactionViewProps = {
    sendShowComponent: (showComponent: string) => void;
};
async function getClientPixableKeys(): Promise<ClientProps> {
    const response = await fetch('http://localhost:5015/api/client/client', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    console.log(response);
    if (response.ok) {
        const client = await response.json();
        return client as ClientProps;
    } else {
        throw new Error('Failed to fetch balance');
    }
}
async function getPix(): Promise<PixProps> {
    const response = await fetch('http://localhost:5015/api/pix/client', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    console.log(response);
    if (response.ok) {
        const pix = await response.json();
        return pix as PixProps;
    } else {
        throw new Error('Failed to fetch balance');
    }
}

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


export default function CardView({ sendShowComponent }: TrasactionViewProps) {
    const [showComponent, setShowComponent] = useState<string>("none");
    const [showModal, setShowModal] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [client, setClient] = useState<ClientProps | null>(null);


    const handleShowComponent = () => {
        setShowComponent("none");
        sendShowComponent(showComponent);
    };

    useEffect(() => {
        getClientPixableKeys().then((client) => setClient(client));
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);

        } catch (error) {

            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <form onSubmit={handleSubmit} className="bg-dark p-4 rounded-lg">
                <div className="flex flex-col mb-4">
                    <label className="text-lightAccent text-sm" htmlFor="cardNumber">
                        Tipo de chave
                    </label>
                    <div className="flex flex-col space-y-2">
                        <label className="flex items-center">
                            <input type="checkbox" name="keyType" value="cpf" className="mr-2" />
                            CPF
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" name="keyType" value="email" className="mr-2" />
                            Email
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" name="keyType" value="phone" className="mr-2" />
                            Telefone
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" name="keyType" value="random" className="mr-2" />
                            Aleatória
                        </label>
                    </div>
                </div>
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
            </form>
            {showModal && <Modal result={result} closeModal={() => setShowModal(false)} />}

        </div>
    );
}