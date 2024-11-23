'use client';

import { useEffect, useState } from "react";
import { CardProps, TransactionProps } from "../local-constants";
import CurrencyInput from "@/global-components/CurrencyInput";
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
export default function AddtTransactionView({ sendShowComponent }: TrasactionViewProps) {
    const [showComponent, setShowComponent] = useState<string>("none");
    const [showModal, setShowModal] = useState(false);
    const [method, setMethod] = useState<string>("none");
    const [paymentMethod, setPaymentMethod] = useState<string>("none");
    const [result, setResult] = useState<number | null>(null);
    const [transaction, setTransaction] = useState<TransactionProps | null>(null);
    const [creditCards, setCreditCards] = useState<CardProps[]>([]);
    const [debitCards, setDebitCards] = useState<CardProps[]>([]);
    const [selectedCard, setSelectedCard] = useState<CardProps | null>(null);

    useEffect(() => {
        async function fetchCards() {
            try {
                const creditCards = await getCreditCards();
                setCreditCards(creditCards);
                const debitCards = await getDebitCards();
                setDebitCards(debitCards);
                console.log(creditCards);
                console.log(debitCards);

            } catch (error) {
                console.error(error);
            }
        }

        fetchCards();
    }, []);
    const handleShowComponent = () => {
        setShowComponent("none");
        sendShowComponent(showComponent);
    };


    const changeSelectedCard = (card: CardProps) => {
        setSelectedCard(card);
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);
            const value = formData.get('type') as string;
            if (value === "1") {
                const response = await fetch('http://localhost:5015/api/transaction/client', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        value: formData.get('value'),
                        paymentMethod: paymentMethod,
                        cardId: selectedCard?._cardId,
                        cvv: formData.get('cvv'),
                    }),
                });
                if (response.ok) {
                    setResult(200);
                } else {
                    setResult(500);
                }
            }

        } catch (error) {

            console.error(error);
        }
    };

    const handleTypeChangeMethod = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const type = event.target.value;
        if (type === "1") {
            setMethod("Pagar");

        }
        if (type === "2") {
            setMethod("Receber");
            setPaymentMethod("Deposito");
        }
    }

    const handleTypeChangePaymentMethod = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const type = event.target.value;
        if (type === "1") {
            setPaymentMethod("Pix");
        }
        if (type === "2") {
            setPaymentMethod("Cartão de Crédito");

        }
        if (type === "3") {
            setPaymentMethod("Cartão de Débito");
        }
        if (type === "4") {
            setPaymentMethod("Deposito");
        }
    }
    async function getCreditCards(): Promise<CardProps[]> {
        const response = await fetch('http://localhost:5015/api/card/client/credito', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        console.log(response);
        if (response.ok) {
            const cards = await response.json();
            return cards;
        } else {
            throw new Error('Failed to fetch cards');
        }
    }

    async function getDebitCards(): Promise<CardProps[]> {
        const response = await fetch('http://localhost:5015/api/card/client/debito', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        console.log(response);
        if (response.ok) {
            const cards = await response.json();
            return cards;
        } else {
            throw new Error('Failed to fetch cards');
        }
    }



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <form onSubmit={handleSubmit} className="bg-dark p-4 rounded-lg">

                <div className="dropdown flex justify-between">
                    <label htmlFor="type">Tipo</label>
                    <select name="type" id="type" className="bg-dark text-white rounded-md p-2" onChange={handleTypeChangeMethod}>
                        <option value="1">Pagar </option>
                        <option value="2">Receber</option>
                    </select>
                </div>

                <div className="dropdown flex justify-between">
                    <label htmlFor="method">Método</label>
                    <select name="method" id="method" className="bg-dark text-white rounded-md p-2" onChange={handleTypeChangePaymentMethod}>
                        {method === "Receber" && (
                            <option value="4">Deposito</option>
                        )}
                        {method === "Pagar" && (
                            <>  <option value="1">Pix</option>
                                <option value="2">Cartão de Crédito</option>
                                <option value="3">Cartão de Débito</option>
                            </>
                        )}
                    </select>
                </div>
                <div className="value flex flex-col space-y-4">
                    <label htmlFor="value">Valor</label>
                    <CurrencyInput name="value" />
                </div>
                {paymentMethod === "Pix" && (
                    <div className="flex flex-col mb-4">
                        <label htmlFor="key">Chave Pix</label>
                        <input
                            type="text"
                            name="key"
                            className="p-2 rounded-md bg-semiDark text-light"
                            placeholder="Chave Pix"
                            required
                        />
                    </div>
                )}
                {paymentMethod === "Cartão de Crédito" && (
                    <><div className="flex flex-col mb-4">
                        <label htmlFor="card">Cartão de Crédito</label>
                        <select
                            name="card"
                            id="card"
                            className="bg-dark text-white rounded-md p-2"
                            onChange={(e) => {
                                const selectedCard = creditCards.find(card => card._cardId === e.target.value);
                                if (selectedCard) {
                                    changeSelectedCard(selectedCard);
                                }
                            }}
                        >
                            {creditCards.map((card) => (
                                <option key={card._cardId} value={card._cardId}>
                                    {card._cardNumber}
                                </option>
                            ))}
                        </select>
                    </div>
                        <div className="flex flex-col mb-4">
                            <label htmlFor="cvv">CVV</label>
                            <input
                                type="text"
                                name="cvv"
                                className="p-2 rounded-md bg-semiDark text-light"
                                placeholder="123"
                                maxLength={3}
                                pattern="\d{3}"
                                onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '')}
                                required
                            />
                        </div>
                    </>
                )
                }
                {
                    paymentMethod === "Cartão de Débito" && (
                        <><div className="flex flex-col mb-4">
                            <label htmlFor="card">Cartão de Débito</label>
                            <select name="card" id="card" className="bg-dark text-white rounded-md p-2">
                                {debitCards.map((card) => (
                                    <option key={card._cardId} value={card._cardId}>
                                        {card._cardNumber}
                                    </option>


                                ))}
                            </select>
                        </div><div className="flex flex-col mb-4">
                                <label htmlFor="cvv">CVV</label>
                                <input
                                    type="text"
                                    name="cvv"
                                    className="p-2 rounded-md bg-semiDark text-light"
                                    placeholder="123"
                                    maxLength={3}
                                    pattern="\d{3}"
                                    onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '')}
                                    required />
                            </div></>

                    )
                }

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


            </form >
            {showModal && <Modal result={result} closeModal={() => setShowModal(false)} />
            }

        </div >
    );
}