"use client";

import { useEffect, useState } from "react";
import { CardProps, PixProps, roboto } from "/src/app/dashboard/local-constants.ts";  // Ajuste o caminho conforme necessário
import Image from "next/image";
import cardIcon from "@public/icons/card.svg";  // Ajuste conforme a localização do ícone
import pixIcon from "@public/icons/qr_code.svg";  // Ajuste conforme a localização do ícone

// Funções para obter as informações de cartões e PIX
async function getCards(): Promise<CardProps[]> {
  const response = await fetch('http://localhost:5015/api/card/client', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Failed to fetch cards');
  }
}

async function getPix(): Promise<PixProps[]> {
  const response = await fetch('http://localhost:5015/api/pix/client', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Failed to fetch PIX keys');
  }
}

export default function Receber() {
  const [cards, setCards] = useState<CardProps[]>([]);
  const [pix, setPix] = useState<PixProps[]>([]);
  const [showAddCard, setShowAddCard] = useState<boolean>(false);
  const [showAddPix, setShowAddPix] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientCards, clientPix] = await Promise.all([getCards(), getPix()]);
        setCards(clientCards);
        setPix(clientPix);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  // Funções de controle para abrir os formulários de adicionar cartão ou pix
  const handleAddCard = () => {
    setShowAddCard(true); // Exemplo de abrir um formulário de adicionar cartão
  };

  const handleAddPix = () => {
    setShowAddPix(true); // Exemplo de abrir um formulário de adicionar chave PIX
  };

  return (
    <div className={`receber_main min-h-screen flex flex-col items-center justify-center ${roboto.className} p-6`}>
      <div className="flex items-center justify-center py-8">
        <h1 className="text-3xl font-playfair text-accent">Receber Pagamentos</h1>
      </div>

      <div className="flex flex-col sm:flex-row items-start justify-between w-full max-w-4xl px-4 space-y-8 sm:space-y-0 sm:space-x-8">
        
        {/* Cartões */}
        <div className="cards_section w-full sm:w-1/2">
          <h2 className="text-3xl font-semibold mb-2">Meus Cartões</h2>
          <button
            className="mt-4 px-4 py-2 bg-accent text-white rounded"
            onClick={handleAddCard}  // Chama a função para exibir o formulário de adicionar cartão
          >
            Adicionar Cartão
          </button>
          <div className="cards_list mt-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-neutral-800">
            <ul className="space-y-4">
              {cards.map((card, index) => (
                <li key={index} className="card_item bg-neutral-700 rounded-lg shadow-md p-4 flex items-center justify-between">
                  <div className="card_info">
                    <p className="text-lg font-semibold">{card._cardNumber.replace(/\d(?=\d{4})/g, "*")}</p>
                    <p className="text-sm text-gray-500">{card._expirationDate.split("T")[0]}</p>
                  </div>
                  <div className="card_icon">
                    <Image src={cardIcon} alt="Card icon" width={36} height={36} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* PIX */}
        <div className="pix_section w-full sm:w-1/2">
          <h2 className="text-3xl font-semibold mb-2">Meus PIX</h2>
          <button
            className="mt-4 px-4 py-2 bg-accent text-white rounded"
            onClick={handleAddPix}  // Chama a função para exibir o formulário de adicionar PIX
          >
            Adicionar PIX
          </button>
          <div className="pix_list mt-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-neutral-800">
            <ul className="space-y-4">
              {pix.map((pixItem, index) => (
                <li key={index} className="pix_item bg-neutral-700 rounded-lg shadow-md p-4 flex items-center justify-between">
                  <div className="pix_info">
                    <p className="text-lg font-semibold">{pixItem._keyType}</p>
                    <p className="text-sm text-gray-500">
                      {pixItem._keyType === 'CPF' ? 'CPF: ' + pixItem._key : 
                       pixItem._keyType === 'Telefone' ? 'Telefone: ' + pixItem._key : 
                       'Email: ' + pixItem._key}
                    </p>
                  </div>
                  <div className="pix_icon">
                    <Image src={pixIcon} alt="Pix icon" width={36} height={36} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Condicional para exibir formulários de adicionar Cartão ou Pix */}
      {showAddCard && <div>Adicionar Cartão</div>}  {/* Aqui você pode colocar seu formulário de adicionar cartão */}
      {showAddPix && <div>Adicionar PIX</div>}      {/* Aqui você pode colocar seu formulário de adicionar PIX */}
    </div>
  );
}
