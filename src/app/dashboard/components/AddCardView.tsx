'use client';

import { useEffect, useState } from "react";
import { CardProps } from "../local-constants";
import CurrencyInput from "@/global-components/CurrencyInput";
type CardViewProps = {
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


export default function CardView({ sendShowComponent }: CardViewProps) {
    const [showComponent, setShowComponent] = useState<string>("none");
    const [isDebit, setIsDebit] = useState(false);
    const [isCredit, setIsCredit] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const formatCardNumber = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        let value = input.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        input.value = value.trim();
    };

    const handleShowComponent = () => {
        setShowComponent("none");
        sendShowComponent(showComponent);
    };


    const handleReponseToString = (response: Response) => {
        if (response.status === 200) {
            return "Cartão cadastrado com sucesso.";
        }
        if (response.status === 500) {
            return "Houve um erro no servidor.";
        }
        if (response.status === 401) {
            return "Você não tem permissão para realizar esta ação.";
        }
        if (response.status === 409) {
            return "Cartão já cadastrado.";
        }
        return "Erro desconhecido.";
    }

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;

        if (value === 'debit') {
            setIsDebit(checked);
        } else if (value === 'credit') {
            setIsCredit(checked);
        }
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        console.log(value);
        if (value < new Date().toISOString().split('T')[0]) {
            console.log("Data inválida");
        }
    }


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        /* 
                private _cardId: number;
                private _expirationDate: Date;
                private _cardNumber: string;
                private _cvv: string;
                private _cardType: string;
                private _limit: number;
                private _clientId: number; */
        try {
            const formData = new FormData(event.currentTarget);
            let cardNumber = formData.get('cardNumber');
            cardNumber = cardNumber ? cardNumber.toString().replace(/\s/g, '') : '';
            const cvv = formData.get('cvv');
            const expirationDate = formData.get('expirationDate');

            if (expirationDate && expirationDate < new Date().toISOString().split('T')[0]) {
                setShowModal(true);
                setResult("Data inválida");
                return;
            }


            let cardType = '';
            if (isDebit) {
                cardType += 'debito ';
            }
            if (isCredit) {
                cardType += 'credito';
            }
            cardType = cardType.trim();
            const limitValue = formData.get('limit')?.toString().replace(/[^\d,]/g, '').replace(',', '.');
            const limit = limitValue ? parseFloat(limitValue) : 0;
            const body = {
                cardNumber,
                cvv,
                expirationDate,
                cardType,
                limit
            };
            console.log(JSON.stringify(body));


            const response = await fetch('http://localhost:5015/api/card/client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                credentials: 'include',
            });
            console.log(response);

            setShowModal(true);
            setResult(handleReponseToString(response));
        } catch (error) {

            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <form onSubmit={handleSubmit} className="bg-dark p-4 rounded-lg">
                <button
                    className="bg-rose-800 hover:bg-rose-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={handleShowComponent}
                >
                    X
                </button>
                <div className="flex flex-col mb-4">
                    <label className="text-sm text-light">Número do Cartão</label>
                    <input
                        type="text"
                        name="cardNumber"
                        className="p-2 rounded-md bg-semiDark text-light"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        pattern="\d{4}\s\d{4}\s\d{4}\s\d{4}"
                        onInput={(e) => formatCardNumber(e)}
                        required
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <input
                        type="text"
                        name="cvv"
                        className="p-2 rounded-md bg-semiDark text-light"
                        maxLength={3}
                        pattern="\d{3}"
                        placeholder="123"
                        onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '')}
                        required
                    />
                </div>

                <div className="flex flex-col mb-4">
                    <input

                        type="month"

                        name="expirationDate"

                        className="p-2 rounded-md bg-semiDark text-light"

                        onChange={handleDateChange}

                        required

                    />
                </div>

                <div className="flex flex-col mb-4">
                    <div className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            name="cardType"
                            value="debit"
                            className="mr-2"
                            checked={isDebit}
                            onChange={handleCheckboxChange}
                            required={!isCredit}
                        />
                        <span className="text-light">Débito</span>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="cardType"
                            value="credit"
                            className="mr-2"
                            checked={isCredit}
                            onChange={handleCheckboxChange}
                            required={!isDebit}
                        />
                        <span className="text-light">Crédito</span>
                    </div>
                </div>

                {isCredit && (
                    <div className="flex flex-col mb-4">
                        <label className="text-sm text-light">Limite</label>
                        <CurrencyInput
                            name="limit"
                            className="p-2 rounded-md bg-semiDark text-light"
                            required
                        />


                    </div>
                )}
                <div className="flex items-center justify-between">
                    <button
                        className="bg-accent hover:bg-lightAccent text-dark font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Cadastrar
                    </button>

                </div>
            </form>
            {showModal && <Modal result={result} closeModal={() => setShowModal(false)} />}

        </div>
    );
}