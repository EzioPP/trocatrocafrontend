'use client';
import { useState, useEffect } from "react";

interface PixKey {
    id: string;
    keyType: string;
    keyValue: string;
}

async function getClient(): Promise<{ _balance: string; cpf: string; email: string; telefone: string }> {
    const response = await fetch('http://localhost:5015/api/client/client', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });

    // Verifique a resposta antes de parsear
    const textResponse = await response.text(); // Lê a resposta como texto

    // Imprime a resposta no console para depuração
    console.log('Resposta bruta:', textResponse);

    try {
        const client = JSON.parse(textResponse); // Tenta fazer o parse manualmente
        client._balance = parseFloat(client._balance).toFixed(2);
        return client;
    } catch (error) {
        throw new Error('Erro ao analisar a resposta da API. ' + error.message);
    }
}

async function getPixKeys(): Promise<PixKey[]> {
    const response = await fetch('http://localhost:5015/api/pix/client', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });

    // Verifique a resposta antes de parsear
    const textResponse = await response.text(); // Lê a resposta como texto

    // Imprime a resposta no console para depuração
    console.log('Resposta das chaves Pix:', textResponse);

    try {
        const pixKeys = JSON.parse(textResponse); // Tenta fazer o parse manualmente
        return pixKeys;
    } catch (error) {
        throw new Error('Erro ao analisar as chaves Pix. ' + error.message);
    }
}

async function receivePix(amount: number, pixKeyId: string): Promise<string> {
    const response = await fetch('http://localhost:5015/api/pix/receive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount, pixKeyId }),
    });

    if (response.ok) {
        return "Pix recebido com sucesso!";
    } else {
        const error = await response.json();
        throw new Error(error.message || "Erro ao receber Pix");
    }
}

export default function ReceivePix() {
    const [balance, setBalance] = useState<number>(0);
    const [amount, setAmount] = useState<string>(""); 
    const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
    const [selectedPixKey, setSelectedPixKey] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [clientInfo, setClientInfo] = useState<{ cpf: string, email: string, telefone: string }>({
        cpf: '',
        email: '',
        telefone: '',
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const client = await getClient();
                setBalance(parseFloat(client._balance));
                setClientInfo({
                    cpf: client.cpf,
                    email: client.email,
                    telefone: client.telefone
                });

                const keys = await getPixKeys();
                setPixKeys(keys);

                if (keys.length > 0) {
                    setSelectedPixKey(keys[0].id); // Selecionar a primeira chave por padrão
                }
            } catch (error) {
                console.error(error);
                setMessage("Erro ao carregar dados");
            }
        }

        fetchData();
    }, []);

    const handleReceivePix = async () => {
        try {
            const pixAmount = parseFloat(amount);

            if (isNaN(pixAmount) || pixAmount <= 0) {
                setMessage("Digite um valor válido para o Pix.");
                return;
            }

            if (!selectedPixKey) {
                setMessage("Selecione uma chave Pix válida.");
                return;
            }

            if (pixAmount > balance) {
                setMessage("Erro: O valor do Pix excede o saldo disponível.");
                return;
            }

            await receivePix(pixAmount, selectedPixKey);
            setBalance((prevBalance) => prevBalance - pixAmount);
            setMessage("Pix recebido com sucesso!");
            setAmount("");
        } catch (error: any) {
            setMessage(error.message || "Erro ao processar o Pix.");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-100 flex flex-col">
            {/* Cabeçalho */}
            <header className="w-full bg-white shadow-md py-4 mb-8">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <h1 className="text-3xl font-bold text-blue-900">
                            Troca Troca Transações
                        </h1>
                    </div>
                    <div className="text-gray-600 text-base">
                        <p>Bem-vindo(a)</p>
                        <p className="font-medium">Acesse suas opções abaixo</p>
                    </div>
                </div>
            </header>

            {/* Camada branca com o conteúdo centralizado */}
            <div className="flex flex-grow justify-center items-center bg-neutral-100">
                <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg flex flex-col items-center gap-6">
                    <h2 className="text-2xl font-semibold text-blue-900 mb-4">Receber Pix</h2>
                    <p className="text-lg text-gray-600 mb-6">Saldo disponível: R$ {balance.toFixed(2)}</p>

                    <div className="flex flex-col items-center w-full">
                        <label className="text-sm font-medium text-gray-700 mb-2">Selecione a chave Pix:</label>
                        <select
                            value={selectedPixKey}
                            onChange={(e) => setSelectedPixKey(e.target.value)}
                            className="mb-4 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 w-72"
                        >
                            {pixKeys.map((key) => (
                                <option key={key.id} value={key.id}>
                                    {key.keyType}: {key.keyValue}
                                </option>
                            ))}
                        </select>

                        <div className="w-full">
                            <p className="text-sm font-medium text-gray-700">Dados de cadastro:</p>
                            <p className="text-sm text-gray-600">CPF: {clientInfo.cpf}</p>
                            <p className="text-sm text-gray-600">E-mail: {clientInfo.email}</p>
                            <p className="text-sm text-gray-600">Telefone: {clientInfo.telefone}</p>
                        </div>

                        <input
                            type="number"
                            step="0.01"
                            placeholder="Digite o valor do Pix"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="mb-4 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 w-72 text-center"
                        />
                        <button
                            onClick={handleReceivePix}
                            className="px-8 py-3 bg-green-700 text-white rounded-md shadow-md hover:bg-green-600 transition duration-300 w-full text-lg font-semibold"
                        >
                            Receber Pix
                        </button>
                    </div>

                    {message && <p className="mt-6 text-lg text-gray-700 text-center">{message}</p>}
                </div>
            </div>

            {/* Logo no canto inferior direito */}
            <img
                src="/logo2.svg"
                alt="Logo"
                className="w-64 h-64 fixed bottom-6 right-6 object-contain"
            />
        </div>
    );
}
