'use client'
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
        throw error; // Re-lança o erro para ser tratado no catch externo
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

function getPixKeys(client: ClientProps, keyType: string): string {
    if (keyType === 'CPF') return client._cpf;
    if (keyType === 'Telefone') return client._phone;
    if (keyType === 'Email') return client._email;
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
        console.log(show);
        setShowComponent(show);
    }, []);

    useEffect(() => {
        async function fetchAllData() {
            try {
                // Carregando os dados
                const clientCards = await getCards();
                const clientTransactions = await getTransactions();
                const clientData = await getClient();
                const clientPix = await getPix();

                // Atualizando os estados
                setTransactions(clientTransactions);
                setCards(clientCards);
                setClient(clientData);
                setPix(clientPix);
            } catch (error) {
                console.error("Erro ao carregar dados do cliente, cartões ou transações:", error.message || error);
            }
        }

        fetchAllData();
    }, []);

    // Se os dados ainda estão sendo carregados, mostre uma mensagem de loading
    if (!client || cards.length === 0 || pix.length === 0) {
        return <div>Carregando dados...</div>;
    }

    return (
        <div className={`dashboard_main min-h-screen flex flex-col items-center justify-center ${roboto.className} p-6`}>
            {showComponent === "viewCard" && <CardView sendShowComponent={sendShowComponent} card={selectedCard} />}
            {showComponent === "addCard" && <AddCardView sendShowComponent={sendShowComponent} />}
            {showComponent === "addPix" && <AddPixKeyView sendShowComponent={sendShowComponent} />}
            {showComponent === "addTransaction" && <AddtTransactionView sendShowComponent={sendShowComponent} />}

            <div className="flex items-center justify-center py-8">
                <h1 className="text-3xl font-playfair text-accent">Troca Troca Transações</h1>
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
                            <button className="mt-4 px-4 py-2 bg-accent text-white rounded" onClick={() => setShowComponent("addTransaction")}>Realizar Transação</button>
                        </div>
                    </div>
                </div>

                <div className="registered-pix text-center mb-8">
                    <h2 className="text-3xl font-semibold mb-2">Chaves PIX</h2>
                    <button className="mt-4 px-4 py-2 bg-accent text-white rounded" onClick={() => setShowComponent("addPix")}>Adicionar Pix</button>
                    <div className="pix_list mt-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-neutral-800">
                        <ul className="space-y-4">
                            {pix.map((pixItem, index) => (
                                <li key={index} className="pix_item bg-neutral-700 rounded-lg shadow-md p-4 flex items-center justify-between">
                                    <div className="pix_info">
                                        <p className="text-lg font-semibold">{pixItem._keyType}</p>
                                        <p className="text-sm text-gray-500">{getPixKeys(client, pixItem._keyType)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="cards_info text-center mb-8">
                    <h2 className="text-3xl font-semibold mb-2">Cartões</h2>
                    <p className="text-2xl font-bold text-accent">{cards.length}</p>
                    <button className="mt-4 px-4 py-2 bg-accent text-white rounded" onClick={() => setShowComponent("addCard")}>Adicionar Cartão</button>

                    <div className="cards_list mt-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-neutral-800">
                        <ul className="space-y-4">
                            {cards.map((card, index) => (
                                <li key={index} className="card_item bg-neutral-700 rounded-lg shadow-md p-4 flex items-center justify-between">
                                    <div className="card_info">
                                        <p className="text-lg font-semibold">{card._cardNumber.replace(/\d(?=\d{4})/g, "*")}</p>
                                        <p className="text-sm text-gray-500">{card._expirationDate.split("T")[0]}</p>
                                    </div>
                                    <div className="card_icon">
                                        <a href="#" onClick={() => { setSelectedCard(card); setShowComponent("viewCard") }}>
                                            <Image priority src={cardIcon} alt="Card icon" width={36} height={36} />
                                        </a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
