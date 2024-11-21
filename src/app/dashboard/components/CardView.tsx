'use client';

import { useState } from "react";
import { CardProps } from "../local-constants";
import delete_forever from "@public/icons/delete_forever.svg";
import Image from "next/image";
type CardViewProps = {
    sendShowComponent: (showComponent: string) => void;
    card: CardProps | null;

};


export default function CardView({ card, sendShowComponent }: CardViewProps) {
    const [showComponent, setShowComponent] = useState<string>("none");

    const handleShowComponent = () => {
        setShowComponent("none");
        sendShowComponent(showComponent);
    };

    const handleDeleteCard = () => {
        fetch(`http://localhost:5015/api/card/client/${card?._cardId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        handleShowComponent();
        sendShowComponent("none");
        location.reload();

    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-semiDark p-4 rounded-lg">
                {card && (
                    <>
                        <p className="text-xl text-light">
                            Número: {card._cardNumber}
                        </p>
                        <p className="text-xl text-light">
                            CVV: {card._cvv}
                        </p>
                        <p className="text-xl text-light">
                            Tipo: {card._cardType}
                        </p>
                        {card._limit !== 0 && (
                            <p className="text-xl text-light">
                                Limite: {card._limit} R$
                            </p>
                        )}
                        <p className="text-xl text-light">
                            Data de Expiração: {card._expirationDate}
                        </p>

                    </>
                )}
                <div className="flex items-center justify-between">
                    <button
                        className="bg-rose-800 hover:bg-rose-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={handleShowComponent}
                    >
                        Cancelar
                    </button>
                    <a href="#" className="text-red-800 hover:text-accent" onClick={() => {
                        if (confirm("Cartão será deletado, tem certeza?")) {
                            handleDeleteCard();
                            alert("Cartão deletado com sucesso!");
                        }
                    }}>
                        <Image src={delete_forever} alt="Delete" width={24} height={24} className="text-red-800" />
                    </a>
                </div>

            </div>
        </div>
    );
}