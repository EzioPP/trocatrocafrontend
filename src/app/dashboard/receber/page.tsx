'use client';
import { useState, useEffect } from "react";

interface PixKey {
    id: string;
    keyType: string;
    keyValue: string;
}

interface ClientProps {
    _balance: string;
}

async function getClient(): Promise<ClientProps> {
    const response = await fetch('http://localhost:5015/api/client/client', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (response.ok) {
        const client = await response.json();
        client._balance = parseFloat(client._balance).toFixed(2);
        return client;
    } else {
        throw new Error('Failed to fetch client');
    }
}

async function getPix(): Promise<PixKey[]> {
    const response = await fetch('http://localhost:5015/api/pix/client', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch Pix keys');
    }
}

export default function BalanceManager() {
    const [balance, setBalance] = useState<number>(0);
    const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
    const [selectedPixKey, setSelectedPixKey] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        async function fetchData() {
            try {
                const client = await getClient();
                setBalance(parseFloat(client._balance));

                const keys = await getPix();
                console.log("Chaves Pix carregadas:", keys); // Verifica se as chaves foram carregadas
                setPixKeys(keys);

                if (keys.length > 0) {
                    setSelectedPixKey(keys[0].id); // Define uma chave padrão se disponível
                } else {
                    setMessage("Nenhuma chave Pix encontrada.");
                }
            } catch (error) {
                console.error(error);
                setMessage("Erro ao carregar dados do cliente ou chaves Pix.");
            }
        }

        fetchData();
    }, []);

    const handleUpdateBalance = () => {
        const value = parseFloat(amount);
        if (isNaN(value) || value <= 0) {
            setMessage("Digite um valor válido.");
            return;
        }

        if (!selectedPixKey) {
            setMessage("Selecione uma chave Pix válida.");
            return;
        }

        if (value > balance) {
            setMessage("Saldo insuficiente.");
            return;
        }

        setBalance((prev) => prev - value);
        setMessage(`R$ ${value.toFixed(2)} descontados usando a chave Pix (${selectedPixKey}).`);
        setAmount("");
    };

    return (
        <div className="min-h-screen bg-blue-100 flex flex-col">
            <header className="w-full bg-white shadow-md py-4 mb-8">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-blue-900">
                        Gerenciador de Saldo com Pix
                    </h1>
                </div>
            </header>

            <div className="flex flex-grow justify-center items-center bg-blue-100">
                <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg flex flex-col items-center gap-6">
                    <h2 className="text-2xl font-semibold text-blue-900 mb-4">Saldo Atual</h2>
                    <p className="text-lg text-gray-600 mb-6">R$ {balance.toFixed(2)}</p>

                    {pixKeys.length > 0 ? (
                        <div className="flex flex-col items-center w-full">
                            <label className="text-sm font-medium text-gray-700 mb-2">Selecione a chave Pix:</label>
                            <select
                                value={selectedPixKey}
                                onChange={(e) => setSelectedPixKey(e.target.value)}
                                className="mb-4 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 w-72"
                            >
                                {pixKeys.map((key) => (
                                    <option key={key.id} value={key.keyValue}>
                                        {key.keyType}: {key.keyValue}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="number"
                                step="0.01"
                                placeholder="Digite o valor"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="mb-4 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 w-72 text-center"
                            />
                            <button
                                onClick={handleUpdateBalance}
                                className="px-8 py-3 bg-green-700 text-white rounded-md shadow-md hover:bg-green-600 transition duration-300 w-full text-lg font-semibold"
                            >
                                Descontar Saldo
                            </button>
                        </div>
                    ) : (
                        <p className="text-lg text-gray-700 text-center">
                            Nenhuma chave Pix disponível para seleção.
                        </p>
                    )}

                    {message && <p className="mt-6 text-lg text-gray-700 text-center">{message}</p>}
                </div>
            </div>
        </div>
    );
}
