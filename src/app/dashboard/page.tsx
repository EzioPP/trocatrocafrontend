'use client'
import Image from "next/image";
import { use, useCallback, useEffect, useState } from "react";
import { Playfair_Display, Roboto } from "next/font/google";
import documentIcon from "@public/icons/document.svg";
import cardIcon from "@public/icons/card.svg";
import CardView from "./components/CardView";
import { CardProps, TransactionProps, roboto, playfair } from "./local-constants";
import AddCardView from "./components/AddCardView";

async function getClientBalance(): Promise<number> {
    const response = await fetch('http://localhost:5015/api/client/client', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    console.log(response);
    if (response.ok) {
        const client = await response.json();
        console.log("Client");
        console.log(client);
        console.log(client._balance);
        return client._balance;
    } else {
        throw new Error('Failed to fetch balance');
    }
}
async function getTransactions(): Promise<TransactionProps[]> {
    const response = await fetch('http://localhost:5015/api/transaction/client', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    console.log(response);
    if (response.ok) {
        const transactions = await response.json();
        console.log(transactions);
        return transactions;
    } else {
        throw new Error('Failed to fetch transactions');
    }
}

async function getCards(): Promise<CardProps[]> {
    const response = await fetch('http://localhost:5015/api/card/client', {
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

async function viewCard(card: CardProps) {
    console.log(card);
}


export default function Dashboard() {
    const [showComponent, setShowComponent] = useState<string | null>("none");


    const [transactions, setTransactions] = useState<TransactionProps[]>([]);
    const [cards, setCards] = useState<CardProps[]>([]);
    const [selectedCard, setSelectedCard] = useState<CardProps | null>(null);
    const [balance, setBalance] = useState<number>(0);


    const sendShowComponent = useCallback((show: string) => {
        console.log(show);
        setShowComponent(show);
    }
        , []);


    useEffect(() => {
        async function fetchData() {
            try {
                const clientBalance = await getClientBalance();
                const clientCards = await getCards();
                const clientTransactions = await getTransactions();
                setTransactions(clientTransactions);
                setCards(clientCards);
                setBalance(clientBalance);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);



    return (
        <div className={`dashboard_main min-h-screen flex flex-col items-center justify-center ${roboto.className} p-6`}>
            {showComponent === "viewCard" && <CardView sendShowComponent={sendShowComponent} card={selectedCard} />}
            {showComponent === "addCard" && <AddCardView sendShowComponent={sendShowComponent} />}
            <div className="flex items-center justify-center">
                <h1 className="text-3xl font-playfair text-accent"> Troca Troca Transações </h1>
            </div>
            <div className="header text-center mb-8 flex items-center justify-between w-full max-w-4xl">
                <div className="balance_info text-center mb-8">
                    <h2 className="text-3xl font-semibold mb-2">Saldo</h2>
                    <p className="text-2xl font-bold text-accent">${balance}</p>
                    <div className="make_transaction text-center mb-8">
                        <button className="mt-4 px-4 py-2 bg-accent text-white rounded" onClick={() => { setShowComponent("makeTransaction") }
                        }>Realizar Transação</button>
                    </div>
                </div>
                <div className="pix-cards flex flex-row items-center justify-between w-full max-w-4xl pl-80">

                    <div className="registered-pix text-center mb-8">
                        <h2 className="text-3xl font-semibold mb-2">Chaves PIX</h2>
                        <button className="mt-4 px-4 py-2 bg-accent text-white rounded" onClick={() => { setShowComponent("addPix") }}>Adicionar Pix</button>


                    </div>
                    <div className="cards_info text-center mb-8">
                        <h2 className="text-3xl font-semibold mb-2">Cartões</h2>

                        <p className="text-2xl font-bold text-accent">{cards.length}</p>
                        <button className="mt-4 px-4 py-2 bg-accent text-white rounded" onClick={() => { setShowComponent("addCard") }}>Adicionar Cartão</button>

                        <div className="cards_list mt-4">
                            <div className="cards_list mt-4 max-h-64 overflow-y-auto">
                                <ul className="space-y-4">
                                    {cards.map((card, index) => (
                                        <li key={index} className="card_item bg-neutral-700 rounded-lg shadow-md p-4 flex items-center justify-between">
                                            <div className="card_info">
                                                <p className="text-lg font-semibold">{card._cardNumber.replace(/\d(?=\d{4})/g, "*")}</p>
                                                <p className="text-sm text-gray-500">
                                                    {card._expirationDate.split("T")[0]}
                                                </p>

                                            </div>
                                            <div className="card_icon">
                                                <a href="#" onClick={() => { setSelectedCard(card); setShowComponent("viewCard") }}>
                                                    <Image
                                                        priority
                                                        src={cardIcon}
                                                        alt="Card icon"
                                                        width={36}
                                                        height={36}
                                                    />
                                                </a>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="transactions p-6 rounded-lg shadow-lg w-full max-w-4xl flex flex-col items-center">
                <div className="transactions_info text-center mb-4">
                    <h2 className="text-3xl font-semibold mb-2">Transações</h2>
                </div>
                <div className="transactions_list w-full flex justify-center">
                    <ul className="space-y-4 w-full max-w-4xl">
                        {transactions.map((transaction, index) => (
                            <li
                                key={index}
                                className="transaction_item bg-neutral-700 rounded-lg shadow-md p-4 flex items-center justify-between"
                            >
                                <div className="transaction_info flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                                    <div className="flex space-x-4">
                                        <p className="date text-sm text-gray-500">{transaction._date}</p>
                                        <p className={`text-lg font-semibold ${transaction._value > 0 ? "text-green-500" : "text-red-800"}`}>R$ {transaction._value}</p>
                                    </div>
                                    <div className="flex space-x-4">
                                        <p className="type text-sm text-gray-500">{transaction._type}</p>
                                        <p
                                            className={`status text-sm ${transaction._status === "Aprovado"
                                                ? "text-green-500"
                                                : transaction._status === "Recusado"
                                                    ? "text-red-500"
                                                    : "text-yellow-500"
                                                }`}
                                        >
                                            {transaction._status}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

    );
}
