'use client';
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import documentIcon from "@public/icons/document.svg";
import cardIcon from "@public/icons/card.svg";
import renan from "@public/renan.jpg";
import CardView from "./components/CardView";
import AddCardView from "./components/AddCardView";
import AddPixKeyView from "./components/AddPixKeyView";
import AddtTransactionView from "./components/AddTransactionView";

import { CardProps, TransactionProps, roboto, playfair, PixProps, ClientProps } from "./local-constants";

// Função para buscar dados de um endpoint
const fetchData = async (endpoint: string): Promise<any> => {
    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!response.ok) {
            console.error(`Erro na resposta do servidor: ${response.status} - ${response.statusText}`);
            throw new Error(`Falha ao obter dados do endpoint: ${endpoint}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Erro ao tentar buscar do endpoint ${endpoint}:`, error.message || error);
        throw error;
    }
};

async function getCards(): Promise<CardProps[]> {
    return await fetchData('http://localhost:5015/api/card/client');
}

async function getTransactions(): Promise<TransactionProps[]> {
    return await fetchData('http://localhost:5015/api/transaction/client');
}

async function getClient(): Promise<ClientProps> {
    const clientData = await fetchData('http://localhost:5015/api/client/client');
    if (!clientData) {
        throw new Error('Cliente não encontrado');
    }
    clientData._balance = parseFloat(clientData._balance).toFixed(2);
    return clientData as ClientProps;
}

async function getPix(): Promise<PixProps[]> {
    return await fetchData('http://localhost:5015/api/pix/client');
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
        throw new Error('Falha ao sair');
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
        setShowComponent(show);
    }, []);

    useEffect(() => {
        async function fetchAllData() {
            try {
                const clientCards = await getCards();
                const clientTransactions = await getTransactions();
                const clientData = await getClient();
                const clientPix = await getPix();

                setTransactions(clientTransactions);
                setCards(clientCards);
                setClient(clientData);
                setPix(clientPix);
            } catch (error) {
                console.error("Erro ao carregar dados:", error.message || error);
            }
        }

        fetchAllData();
    }, []);

    if (!client || cards.length === 0 || pix.length === 0) {
        return <div>Carregando dados...</div>;
    }

    return (
        <div className={`min-h-screen flex flex-col items-center ${roboto.className} bg-gray-100`}>
            <header className="w-full bg-blue-900 text-white py-4 shadow-lg">
                <h1 className="text-center text-3xl font-playfair">Troca Troca Transações</h1>
            </header>
            <div className="container max-w-6xl mx-auto p-6">
                <div className="flex flex-wrap justify-between items-center mb-8">
                    <div className="flex items-center space-x-4">
                        <Image
                            src={renan}
                            alt="Avatar"
                            width={80}
                            height={80}
                            className="rounded-full"
                        />
                        <div>
                            <p className="text-xl font-semibold text-black">{client?._name}</p>
                            <p className="text-sm text-black">{client?._email}</p>
                        </div>
                    </div>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700"
                        onClick={logout}
                    >
                        Sair
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded shadow p-6">
                        <h2 className="text-lg font-semibold text-blue-900 mb-4">Saldo</h2>
                        <p className="text-2xl font-bold text-green-500">${client?._balance}</p>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                            onClick={() => setShowComponent("addTransaction")}
                        >
                            Realizar Transação
                        </button>
                    </div>
                    <div className="bg-white rounded shadow p-6">
                        <h2 className="text-lg font-semibold text-blue-900 mb-4">Chaves PIX</h2>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                            onClick={() => setShowComponent("addPix")}
                        >
                            Adicionar Pix
                        </button>
                        <ul className="mt-4 space-y-2">
                            {pix.map((pixItem, index) => (
                                <li key={index} className="bg-gray-100 p-2 rounded shadow">
                                    <p className="text-sm font-medium text-black">{pixItem._keyType}</p>
                                    <p className="text-xs text-black">{pixItem._keyValue}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white rounded shadow p-6">
                        <h2 className="text-lg font-semibold text-blue-900 mb-4">Cartões</h2>
                        <p className="text-2xl">{cards.length} Cartões</p>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                            onClick={() => setShowComponent("addCard")}
                        >
                            Adicionar Cartão
                        </button>
                        <ul className="mt-4 space-y-2">
                            {cards.map((card, index) => (
                                <li key={index} className="bg-black-100 p-2 rounded shadow">
                                    <p className="text-sm text-black">{card._cardNumber.replace(/\d(?=\d{4})/g, "*")}</p>
                                    <p className="text-xs text-black">{card._expirationDate}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
