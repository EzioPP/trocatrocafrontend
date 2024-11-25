'use client';
import { useState, useEffect } from "react";

interface Transaction {
    date: string;
    description: string;
    amount: number;
}

async function getClient(): Promise<{ _balance: string; cpf: string; email: string; telefone: string }> {
    const response = await fetch('http://localhost:5015/api/client/client', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });

    const textResponse = await response.text();
    try {
        const client = JSON.parse(textResponse);
        client._balance = parseFloat(client._balance).toFixed(2);
        return client;
    } catch (error) {
        throw new Error('Erro ao analisar a resposta da API. ' + error.message);
    }
}

async function getTransactions(): Promise<Transaction[]> {
    const response = await fetch('http://localhost:5015/api/transactions', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error(`Erro na API de transações: ${response.statusText}`);
    }

    const textResponse = await response.text();
    try {
        const transactions = JSON.parse(textResponse);
        return transactions;
    } catch (error) {
        throw new Error('Erro ao processar resposta JSON: ' + error.message);
    }
}

export default function BalancePage() {
    const [balance, setBalance] = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        async function fetchData() {
            try {
                const client = await getClient();
                setBalance(parseFloat(client._balance));

                const transactionsData = await getTransactions();
                setTransactions(transactionsData);
            } catch (error: any) {
                if (error instanceof Error) {
                    console.error("Erro ao carregar dados:", error.message);
                    setMessage(error.message);
                } else {
                    console.error("Erro desconhecido:", error);
                    setMessage("Erro desconhecido ao carregar dados.");
                }
            }
        }

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Cabeçalho */}
            <header className="bg-blue-900 text-white py-4">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Banco XYZ</h1>
                    <div className="text-sm">
                        <p className="text-white">Bem-vindo(a)</p>
                        <p className="font-medium text-white">Saldo disponível: R$ {balance.toFixed(2)}</p>
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <div className="max-w-4xl mx-auto py-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-black">Resumo da Conta</h2>
                    <div className="space-y-4 mb-6 text-black">
                        <p className="text-black"><strong>Saldo:</strong> R$ {balance.toFixed(2)}</p>
                    </div>

                    <h3 className="text-lg font-semibold mb-4 text-black">Histórico de Compras</h3>
                    <div className="space-y-4">
                        {transactions.length > 0 ? (
                            transactions.map((transaction, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center border-b py-2 text-black"
                                >
                                    <p className="text-black font-medium">{transaction.date}</p>
                                    <p className="text-black">{transaction.description}</p>
                                    <p
                                        className={`${
                                            transaction.amount < 0 ? 'text-red-500' : 'text-green-500'
                                        } font-semibold`}
                                    >
                                        {transaction.amount < 0 ? '-' : '+'} R$ {Math.abs(transaction.amount).toFixed(2)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-black">Não há transações para mostrar.</p>
                        )}
                    </div>

                    {message && <p className="mt-4 text-center text-red-500">{message}</p>}
                </div>
            </div>
        </div>
    );
}
