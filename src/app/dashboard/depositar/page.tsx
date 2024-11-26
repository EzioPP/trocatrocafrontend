'use client'; 
import { useState, useEffect } from "react";

interface PixKey {
    id: string;
    keyType: string;
    keyValue: string;
    ownerName: string;
}

interface Card {
    id: string;
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
}

interface ClientProps {
    _balance: string;
    cpf: string;
    email: string;
    telefone: string;
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
        const pixs = await response.json();
        return pixs;
    } else {
        throw new Error('Failed to fetch Pix keys');
    }
}

async function getCards(): Promise<Card[]> {
    const response = await fetch('http://localhost:5015/api/card/client', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (response.ok) {
        const cards = await response.json();
        return cards;
    } else {
        throw new Error('Failed to fetch cards');
    }
}

async function addPixKey(pixKey: string, clientId: string): Promise<string> {
    const response = await fetch('http://localhost:5015/api/pix/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pixKey, clientId }),
    });

    if (response.ok) {
        return "Chave Pix adicionada com sucesso!";
    } else {
        const error = await response.json();
        throw new Error(error.message || "Erro ao adicionar chave Pix.");
    }
}

async function addCard(cardNumber: string, cardHolder: string, expiryDate: string, cvv: string, clientId: string): Promise<string> {
    const response = await fetch('http://localhost:5015/api/card/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cardNumber, cardHolder, expiryDate, cvv, clientId }),
    });

    if (response.ok) {
        return "Cartão adicionado com sucesso!";
    } else {
        const error = await response.json();
        throw new Error(error.message || "Erro ao adicionar cartão.");
    }
}

export default function Deposit() {
    const [balance, setBalance] = useState<number>(0);
    const [amount, setAmount] = useState<string>(""); 
    const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedPixKey, setSelectedPixKey] = useState<string>("");
    const [selectedCard, setSelectedCard] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [newPixKey, setNewPixKey] = useState<string>("");
    const [newCard, setNewCard] = useState<{ cardNumber: string, cardHolder: string, expiryDate: string, cvv: string }>({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
    });

    const [clientInfo, setClientInfo] = useState<ClientProps>({ _balance: "0", cpf: "", email: "", telefone: "" });

    useEffect(() => {
        async function fetchData() {
            try {
                const client = await getClient();
                setBalance(parseFloat(client._balance));
                setClientInfo(client);

                const keys = await getPix();
                setPixKeys(keys);

                const cardsList = await getCards();
                setCards(cardsList);
            } catch (error) {
                console.error(error);
                setMessage("Erro ao carregar dados");
            }
        }

        fetchData();
    }, []);

    const handleDeposit = async () => {
        try {
            const depositAmount = parseFloat(amount);

            if (isNaN(depositAmount) || depositAmount <= 0) {
                setMessage("Digite um valor válido para o depósito.");
                return;
            }

            let responseMessage = "";

            if (selectedPixKey) {
                responseMessage = await depositPix(depositAmount, selectedPixKey);
            } else if (selectedCard) {
                responseMessage = await depositCard(depositAmount, selectedCard);
            } else {
                setMessage("Selecione uma chave Pix ou um cartão para o depósito.");
                return;
            }

            setBalance((prevBalance) => prevBalance + depositAmount);
            setMessage(responseMessage);
            setAmount(""); // Limpar o campo de valor
        } catch (error: any) {
            setMessage(error.message || "Erro ao processar o depósito.");
        }
    };

    const handleAddPixKey = async () => {
        try {
            const responseMessage = await addPixKey(newPixKey, clientInfo.cpf);
            setMessage(responseMessage);
            setPixKeys([...pixKeys, { id: Date.now().toString(), keyType: 'CPF', keyValue: newPixKey, ownerName: clientInfo.email }]);
            setNewPixKey(""); // Limpar o campo de chave Pix
        } catch (error: any) {
            setMessage(error.message || "Erro ao adicionar chave Pix.");
        }
    };

    const handleAddCard = async () => {
        try {
            const responseMessage = await addCard(newCard.cardNumber, newCard.cardHolder, newCard.expiryDate, newCard.cvv, clientInfo.cpf);
            setMessage(responseMessage);
            setCards([...cards, {
                id: Date.now().toString(),
                cardNumber: newCard.cardNumber,
                cardHolder: newCard.cardHolder,
                expiryDate: newCard.expiryDate,
                cvv: newCard.cvv
            }]);
            setNewCard({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' }); // Limpar os campos de cartão
        } catch (error: any) {
            setMessage(error.message || "Erro ao adicionar cartão.");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-100 flex flex-col">
            {/* Cabeçalho */}
            <header className="w-full bg-white shadow-md py-4 mb-8">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <h1 className="text-3xl font-bold text-blue-900">Troca Troca Transações</h1>
                    </div>
                    <div className="text-gray-600 text-base">
                        <p>Bem-vindo(a)</p>
                        <p className="font-medium">Acesse suas opções abaixo</p>
                    </div>
                </div>
            </header>

            {/* Formulário de depósito */}
            <div className="flex flex-grow justify-center items-center bg-neutral-100">
                <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg flex flex-col items-center gap-6">
                    <h2 className="text-2xl font-semibold text-blue-900 mb-4">Depositar</h2>
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
                                    {key.keyType}: {key.keyValue} - Proprietário: {key.ownerName}
                                </option>
                            ))}
                        </select>

                        <label className="text-sm font-medium text-gray-700 mb-2">Ou selecione um cartão:</label>
                        <select
                            value={selectedCard}
                            onChange={(e) => setSelectedCard(e.target.value)}
                            className="mb-4 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 w-72"
                        >
                            {cards.map((card) => (
                                <option key={card.id} value={card.id}>
                                    {card.cardHolder} - {card.cardNumber}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            step="0.01"
                            placeholder="Digite o valor do depósito"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="mb-4 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 w-72 text-center"
                        />
                        <button
                            onClick={handleDeposit}
                            className="px-8 py-3 bg-green-700 text-white rounded-md shadow-md hover:bg-green-600 transition duration-300 w-full text-lg font-semibold"
                        >
                            Depositar
                        </button>
                    </div>

                    {/* Adicionar Chave Pix */}
                    <div className="mt-8 w-full text-center">
                        <input
                            type="text"
                            value={newPixKey}
                            onChange={(e) => setNewPixKey(e.target.value)}
                            placeholder="Digite sua chave Pix"
                            className="mb-4 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 w-72"
                        />
                        <button
                            onClick={handleAddPixKey}
                            className="px-8 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-500 transition duration-300 w-full text-lg font-semibold"
                        >
                            Adicionar Chave Pix
                        </button>
                    </div>

                    {/* Adicionar Cartão */}
                    <div className="mt-8 w-full text-center">
                        <input
                            type="text"
                            placeholder="Número do Cartão"
                            value={newCard.cardNumber}
                            onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                            className="mb-4 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 w-72"
                        />
                        <input
                            type="text"
                            placeholder="Nome no Cartão"
                            value={newCard.cardHolder}
                            onChange={(e) => setNewCard({ ...newCard, cardHolder: e.target.value })}
                            className="mb-4 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 w-72"
                        />
                        <input
                            type="text"
                            placeholder="Data de Validade (MM/AAAA)"
                            value={newCard.expiryDate}
                            onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                            className="mb-4 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 w-72"
                        />
                        <input
                            type="text"
                            placeholder="CVV"
                            value={newCard.cvv}
                            onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                            className="mb-4 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 w-72"
                        />
                        <button
                            onClick={handleAddCard}
                            className="px-8 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-500 transition duration-300 w-full text-lg font-semibold"
                        >
                            Adicionar Cartão
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
