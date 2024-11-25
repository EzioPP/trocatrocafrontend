// /pages/depositar.tsx
import { useState } from 'react';
import Link from 'next/link';
import AddCardView from '../components/AddCardView';
import AddPixKeyView from '../components/AddPixKeyView';

const Depositar = () => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddPix, setShowAddPix] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold">Adicionar Cartão ou Pix</h1>
      <div className="buttons mt-4 flex gap-4">
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded"
          onClick={() => setShowAddCard(true)}
        >
          Adicionar Cartão
        </button>
        <button
          className="px-6 py-3 bg-green-500 text-white rounded"
          onClick={() => setShowAddPix(true)}
        >
          Adicionar Pix
        </button>
      </div>

      {showAddCard && <AddCardView />}
      {showAddPix && <AddPixKeyView />}

      <Link href="/page">
        <button className="px-4 py-2 bg-gray-500 text-white rounded mt-4">Voltar ao Menu</button>
      </Link>
    </div>
  );
};

export default Depositar;
