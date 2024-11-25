// /pages/saldo.tsx
import { useState, useEffect } from 'react';
import { getTransactions } from '../local-constants'; // Função que você já tem para pegar transações
import Link from 'next/link';

const Saldo = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getTransactions();
        setTransactions(response);
      } catch (error) {
        console.error('Erro ao carregar as transações:', error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold">Histórico de Transações</h1>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index} className="p-4 bg-neutral-700 rounded-lg mt-4">
            <p>{transaction._transactionDate}: R$ {transaction._value}</p>
            <p>Status: {transaction._status}</p>
          </li>
        ))}
      </ul>
      <Link href="/dashboard">
        <button className="px-4 py-2 bg-gray-500 text-white rounded mt-4">Voltar ao Menu</button>
      </Link>
    </div>
  );
};

export default Saldo;
