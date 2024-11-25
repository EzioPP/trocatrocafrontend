import { Playfair_Display, Roboto } from "next/font/google";

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['900', '700'],
});
const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['700'],
});
type TransactionProps = {
    _transactionId: number;
    _transactionDate: string;
    _value: number;
    _status: string;
    _type: string;
};

type CardProps = {
    _cardId: string;
    _expirationDate: string;
    _cardNumber: string;
    _cvv: string;
    _cardType: string;
    _limit: number;
};

type PixProps = {
    _pixId: number;
    _keyType: string;
    _clientId: number;
};


type ClientProps = {
    _clientId: number;
    _cpf: string;
    _name: string;
    _balance: number;
    _phone: string;
    _email: string;
    _address: string;
};


export { roboto, playfair };
export type { TransactionProps, PixProps, CardProps, ClientProps };
