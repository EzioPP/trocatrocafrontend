import React, { useState } from 'react';

interface CurrencyInputProps {
    name: string;
    className?: string;
    required?: boolean;
}

const CurrencyInput = ({ name, className, required }: CurrencyInputProps) => {
    const [value, setValue] = useState<string>('');


    const formatCurrency = (inputValue: string): string => {
        const numericValue = inputValue.replace(/[^\d]/g, '');
        const formattedValue = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(parseFloat(numericValue) / 100);
        return formattedValue;

    };
    const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.currentTarget.value;
        const formattedValue = formatCurrency(input);
        setValue(formattedValue);
    };
    return (
        <input
            name={name}
            type="text"
            className={className}
            value={value}
            onInput={handleInputChange}
            placeholder="R$ 0,00"
            required={required}
        />
    );
};

export default CurrencyInput;
