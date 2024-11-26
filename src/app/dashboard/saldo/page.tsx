'use client';
import { useState, useEffect, useCallback } from "react";
import { CardProps, TransactionProps, ClientProps } from "./local-constants";
import Image from "next/image";
import renan from "@public/renan.jpg"; // Você pode substituir essa imagem pelo avatar do cliente vindo do backend

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
    clientData._balance = parseFloat(clientData._balance);
    return clientData as ClientProps;
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

export default function Saldo() {
    const [transactions, setTransactions] = useState<TransactionProps[]>([]);
    const [client, setClient] = useState<ClientProps | null>(null);

    useEffect(() => {
        async function fetchAllData() {
            try {
                const clientTransactions = await getTransactions();
                const clientData = await getClient();

                setTransactions(clientTransactions);
                setClient(clientData);
            } catch (error) {
                console.error("Erro ao carregar dados:", error.message || error);
            }
        }

        fetchAllData();
    }, []);

    if (!client || transactions.length === 0) {
        return <div>Carregando dados...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100">
            <header className="w-full bg-blue-900 text-white py-4 shadow-lg">
                <h1 className="text-center text-3xl font-playfair">Saldo e Transações</h1>
            </header>
            <div className="container max-w-6xl mx-auto p-6">
                <div className="flex flex-wrap justify-between items-center mb-8">
                    <div className="flex items-center space-x-4">
                        {/* Exibindo a imagem do perfil */}
                        <div className="relative w-16 h-16 rounded-full overflow-hidden">
                            {/* Aqui você pode substituir a imagem estática pelo link da imagem do cliente */}
                            <Image
                                src={client?._profileImage || renan} // Se o cliente tem imagem, use ela. Caso contrário, use a imagem padrão
                                alt="Avatar"
                                width={64}
                                height={64}
                                className="rounded-full"
                            />
                        </div>
                        <div>
                            <p className="text-xl font-semibold text-black">{client?._name}</p>
                            <p className="text-sm text-black">{client?._email}</p>
                        </div>
                    </div>
                    {/* Botão de Logout */}
                    <button
                        className="ml-auto px-4 py-2 bg-red-500 text-white rounded"
                        onClick={logout}
                    >
                        Sair
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded shadow p-6">
                        <h2 className="text-lg font-semibold text-blue-900 mb-4">Saldo</h2>
                        <p className="text-2xl font-bold text-green-500">${client?._balance}</p>
                    </div>
                </div>

                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-lg font-semibold text-blue-900 mb-4">Histórico de Transações</h2>
                    <ul className="space-y-4">
                        {transactions.length > 0 ? (
                            transactions.map((transaction, index) => (
                                <li key={index} className="p-4 border-b border-gray-200">
                                    <p className="text-sm font-medium text-black">{transaction._description}</p>
                                    <p className="text-xs text-gray-500">{new Date(transaction._date).toLocaleString()}</p>
                                    <p className={`text-lg ${transaction._amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        ${transaction._amount !== undefined && !isNaN(transaction._amount)
                                            ? transaction._amount.toFixed(2)
                                            : 'Erro no valor'}
                                    </p>
                                </li>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Nenhuma transação encontrada.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
