'use client';

import { useEffect, useState } from "react";
import { CardProps, ClientProps, TransactionProps } from "../local-constants";
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
    const [method, setMethod] = useState<string>("Pagar");
    const [paymentMethod, setPaymentMethod] = useState<string>("Pix");
    const [result, setResult] = useState<string | null>(null);
    const [transaction, setTransaction] = useState<TransactionProps | null>(null);
    const [creditCards, setCreditCards] = useState<CardProps[]>([]);
    const [debitCards, setDebitCards] = useState<CardProps[]>([]);
    const [client, setClient] = useState<ClientProps | null>(null);
    const [selectedCard, setSelectedCard] = useState<CardProps | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const creditCards = await getCreditCards();
                setCreditCards(creditCards);
                const debitCards = await getDebitCards();
                setDebitCards(debitCards);
                const client = await getClient();
                setClient(client);

            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);
    const handleShowComponent = () => {
        setShowComponent("none");
        sendShowComponent(showComponent);
    };


    const changeSelectedCard = (card: CardProps) => {
        setSelectedCard(card);
    }

    async function getClient(): Promise<ClientProps> {
        const response = await fetch('http://localhost:5015/api/client/client', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        console.log(response);
        if (response.ok) {
            const client = await response.json();
            if (!client) {
                throw new Error('Failed to fetch client');
            }
            client._balance = parseFloat(client._balance).toFixed(2);

            return client as ClientProps;
        } else {
            throw new Error('Failed to fetch client');
        }
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);
            const type = formData.get('type') as string;
            console.log(type);
            if (type === "2") {
                const value = formData.get('value')?.toString().replace(/[^\d,]/g, '').replace(',', '.');
                if (!value) {
                    console.log("Valor inválido");
                    setShowModal(true);
                    setResult("Valor inválido");
                    return;
                }
                console.log("adasdas");
                let totalValue = parseFloat(value);
                if (totalValue <= 0) {
                    console.log("Valor inválido");
                    setShowModal(true);
                    setResult("Valor inválido");
                    return;
                }


                const body = {
                    value: totalValue,
                    type: "Deposito",
                    status: "Aprovado",
                };

                const response = await fetch('http://localhost:5015/api/transaction/transaction', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                    credentials: 'include',
                });

                if (response.ok) {
                    handleShowComponent();
                    sendShowComponent("none");
                    location.reload();
                    return;
                }
            }
            const method = formData.get('method') as string;
            if (method === "1") {
                const key = formData.get('key') as string;
                if (!key) {
                    console.log("Chave inválida");
                    setShowModal(true);
                    setResult("Chave inválida");
                    return;
                }
                const value = formData.get('value')?.toString().replace(/[^\d,]/g, '').replace(',', '.');
                if (!value) {
                    console.log("Valor inválido");
                    setShowModal(true);
                    setResult("Valor inválido");
                    return;
                }
                let totalValue = parseFloat(value);
                if (totalValue <= 0) {
                    console.log("Valor inválido");
                    setShowModal(true);
                    setResult("Valor inválido");
                    return;
                }


                const keyType = formData.get('keyType') as string;



                const body = {
                    value: totalValue,
                    type: "Pix",
                    status: "Aprovado",
                    key,
                    keyType,

                };

                const response = await fetch('http://localhost:5015/api/transaction/transaction', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                    credentials: 'include',
                });

                if (response.ok) {
                    handleShowComponent();
                    sendShowComponent("none");
                    location.reload();
                    return;
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
            console.log("Pix");
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
                    <><div className="flex flex-col mb-4">
                        <label htmlFor="key">Tipo de chave</label>
                        <select name="keyType" className="bg-dark text-white rounded-md p-2">
                            <option value="CPF">CPF</option>
                            <option value="Email">Email</option>
                            <option value="Telefone">Telefone</option>
                        </select>
                    </div><div className="flex flex-col mb-4">
                            <label htmlFor="key">Chave Pix</label>
                            <input
                                type="text"
                                name="key"
                                className="p-2 rounded-md bg-semiDark text-light"
                                placeholder="Chave Pix"
                                required />
                        </div></>

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
            {showModal && <Modal result={result !== null ? result.toString() : null} closeModal={() => setShowModal(false)} />
            }

        </div >
    );
}