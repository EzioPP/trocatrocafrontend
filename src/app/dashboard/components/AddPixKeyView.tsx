'use client';

import { useEffect, useState } from "react";
import { Clie } from "../local-constants";
import CurrencyInput from "@/global-components/CurrencyInput";
type TrasactionViewProps = {
    sendShowComponent: (showComponent: string) => void;
};
const Modal = ({ result, closeModal }: { result: number | null, closeModal: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-dark p-6 rounded-md shadow-md max-w-sm w-full">
            <p className="mt-4 text-center">
                {result === 200 && "Cartão cadastrado com sucesso."}
                {result === 500 && "Houve um erro no servidor."}
                {result === 401 && "Você não tem permissão para realizar esta ação."}
                {result === 409 && "Cartão já cadastrado."}
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


export default function CardView({ sendShowComponent }: TrasactionViewProps) {
    const [showComponent, setShowComponent] = useState<string>("none");
    const [showModal, setShowModal] = useState(false);
    const [result, setResult] = useState<number | null>(null);


    const handleShowComponent = () => {
        setShowComponent("none");
        sendShowComponent(showComponent);
    };



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
                        Número do cartão
                    </label>

                    <input type="radio" id="debit" name="cardType" value="debit" />

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