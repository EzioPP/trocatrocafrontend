'use client';

import { useEffect, useState } from "react";
import Image from 'next/image';
import { CardProps, ClientProps, TransactionProps } from "../local-constants";
import renan from "@public/renan.jpg";

type ProfileViewProps = {
    client: ClientProps | null;
    cards: CardProps[] | null;
    transactions: TransactionProps[] | null;
    sendShowComponent: (showComponent: string) => void;
};
/* const addImageModal = ({ client, sendShowComponent }: ProfileViewProps) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <input type="file" accept="image/jpg" onChange={(e) => {
            const file = e.target.files ? e.target.files[0] : null;
            if (!file) return;
            const reader = new FileReader();
            reader.onloadend = () => {
                fetch(`http://localhost:5015/api/client/${client?._clientId}/image`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ image: reader.result }),
                });
            };
            reader.readAsDataURL(file);
        }
    </div>
);
 */
export default function ProfileView({ client, cards, transactions, sendShowComponent }: ProfileViewProps) {

    const [showComponent, setShowComponent] = useState<string>("none");

    useEffect(() => {
        if (showComponent === "none") {
            location.reload();
        }
    }
    );

    const handleShowComponent = () => {
        setShowComponent("none");
        sendShowComponent(showComponent);
    };

    const handleDeleteClient = () => {
        fetch(`http://localhost:5015/api/client/${client?._clientId}`, {
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
                {client && (
                    <><>
                        <div className="flex items-center justify-center">
                            <Image src={renan} alt="Renan" width={100} height={100} />
                            <Image src={renan} alt="Renan" />
                        </div><p className="text-xl text-light">
                            Nome: {client._name}
                        </p><p className="text-xl text-light">
                            Email: {client._email}
                        </p><p className="text-xl text-light">
                            CPF: {client._cpf}
                        </p><p className="text-xl text-light">
                            Telefone: {client._phone}
                        </p><p className="text-xl text-light">
                            Endereço: {client._address}
                        </p></><div className="flex items-center justify-between">
                            <button
                                className="bg-accent hover:bg-lightAccent text-dark font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={handleDeleteClient}
                            >
                                Deletar
                            </button>
                            <button
                                className="bg-accent hover:bg-lightAccent text-dark font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={handleShowComponent}
                            >
                                Fechar
                            </button>
                        </div></>
                )}
            </div>
        </div>
    );
}
