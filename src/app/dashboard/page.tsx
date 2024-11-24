'use client'
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import documentIcon from "@public/icons/document.svg";
import cardIcon from "@public/icons/card.svg";
import pixIcon from "@public/icons/qr_code.svg";
import renan from "@public/renan.jpg";
import CardView from "./components/CardView";
import AddCardView from "./components/AddCardView";
import AddPixKeyView from "./components/AddPixKeyView";
import AddtTransactionView from "./components/AddTransactionView";


import { CardProps, TransactionProps, roboto, playfair, PixProps, ClientProps } from "./local-constants";

async function getTransactions(): Promise<TransactionProps[]> {
    const response = await fetch('http://localhost:5015/api/transaction/client', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    console.log(response);
    if (response.ok) {
        const transactions = await response.json();
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
async function getPix(): Promise<PixProps[]> {
    const response = await fetch('http://localhost:5015/api/pix/client', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    console.log(response);
    if (response.ok) {
        const pixs = await response.json();
        console.log("Pixs" + pixs);
        return pixs;
    } else {
        throw new Error('Failed to fetch balance');
    }
}

function getPixKeys(client: ClientProps, keyType: string): string {
    if (keyType === 'CPF') {
        return client._cpf;
    }

    if (keyType === 'Telefone') {
        return client._phone;
    }
    if (keyType === 'Email') {
        console.log("Client object: ", client);
        console.log("Email: ", client._email);
        return client._email;
    }
    return '';
}

async function logout() {
    const response = await fetch('http://localhost:5015/api/user/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (response.ok) {
        window.location.href = "/login";
    } else {
        throw new Error('Failed to logout');
    }
}

export default function Dashboard() {
    const [showComponent, setShowComponent] = useState<string | null>("none");


    const [transactions, setTransactions] = useState<TransactionProps[]>([]);
    const [cards, setCards] = useState<CardProps[]>([]);
    const [selectedCard, setSelectedCard] = useState<CardProps | null>(null);
    const [client, setClient] = useState<ClientProps | null>(null);
    const [pix, setPix] = useState<PixProps[]>([]);


    const sendShowComponent = useCallback((show: string) => {
        console.log(show);
        setShowComponent(show);
    }
        , []);


    useEffect(() => {
        async function fetchData() {
            try {
                const clientCards = await getCards();
                const clientTransactions = await getTransactions();
                const client = await getClient();
                const clientPix = await getPix();
                setTransactions(clientTransactions);
                setCards(clientCards);
                setClient(client);
                setPix(clientPix);
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
            {showComponent === "addPix" && <AddPixKeyView sendShowComponent={sendShowComponent} />}
            {showComponent === "addTransaction" && <AddtTransactionView sendShowComponent={sendShowComponent} />}
            <div className="flex items-center justify-center py-8">
                <h1 className="text-3xl font-playfair text-accent"> Troca Troca Transações </h1>
            </div>
            <div className="header text-center mb-8 flex items-center justify-between w-full max-w-4xl">
                <div className="user text-center mb-8">
                    <div className="user_info text-center mb-8">
                        <div className="user_avatar relative w-32 h-32 rounded-full overflow-hidden">
                            <Image
                                src={renan}
                                alt="Renan"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-full"
                            />
                        </div>
                        <p className="text-lg font-semibold">{client?._name}</p>
                        <p className="text-sm text-gray-500">{client?._email}</p>
                        <button className="logout mt-4 px-4 py-2 bg-rose-900 text-white rounded" onClick={logout}>Sair</button>
                    </div>
                    <div className="balance_info text-center mb-8">
                        <h2 className="text-3xl font-semibold mb-2">Saldo</h2>
                        <p className="text-2xl font-bold text-accent">${client?._balance}</p>
                        <div className="make_transaction text-center mb-8">
                            <button className="mt-4 px-4 py-2 bg-accent text-white rounded" onClick={() => { setShowComponent("addTransaction") }
                            }>Realizar Transação</button>
                        </div>
                    </div>

                </div>
                <div className="pix-cards flex flex-row items-center justify-between w-full max-w-4xl pl-80">

                    <div className="registered-pix text-center mb-8">
                        <h2 className="text-3xl font-semibold mb-2">Chaves PIX</h2>
                        <button className="mt-4 px-4 py-2 bg-accent text-white rounded" onClick={() => { setShowComponent("addPix") }}>Adicionar Pix</button>
                        <div className="pix_list mt-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-neutral-800">
                            <ul className="space-y-4">

                                {pix && pix.map((pix, index) => (
                                    <li key={index} className="pix_item bg-neutral-700 rounded-lg shadow-md p-4 flex items-center justify-between">
                                        <div className="pix_info">
                                            <p className="text-lg font-semibold">{pix._keyType}</p>
                                            <p className="text-sm text-gray-500">
                                                {client && getPixKeys(client, pix._keyType)}
                                            </p>
                                        </div>
                                    </li>
                                ))}

                            </ul>
                        </div>
                    </div>
                    <div className="cards_info text-center mb-8">
                        <h2 className="text-3xl font-semibold mb-2">Cartões</h2>

                        <p className="text-2xl font-bold text-accent">{cards.length}</p>
                        <button className="mt-4 px-4 py-2 bg-accent text-white rounded" onClick={() => { setShowComponent("addCard") }}>Adicionar Cartão</button>

                        <div className="cards_list mt-4">
                            <div className="cards_list mt-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-neutral-800">
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
                        {transactions
                            .sort((a, b) => new Date(b._transactionDate).getTime() - new Date(a._transactionDate).getTime())
                            .map((transaction, index) => (
                                <li
                                    key={index}
                                    className="transaction_item bg-neutral-700 rounded-lg shadow-md p-4 flex items-center justify-between"
                                >
                                    <div className="transaction_info flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                                        <div className="flex space-x-4">
                                            <p className="date text-sm text-gray-500">{transaction._transactionDate.replace("T", " ")
                                                .replace(/\.\d+Z$/, "")
                                                .replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/, "$3/$2/$1 $4:$5")}</p>

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
