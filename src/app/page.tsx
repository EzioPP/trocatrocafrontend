"use client";

import { Playfair_Display } from 'next/font/google';
import { redirect } from 'next/navigation';
const name = 'Troca Troca Transações';
const motto = 'Troca Troca Transações Divitiae et voluptates: duo in uno';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
});
export default function Home() {
  return (
    <>
      <div>
        <div id="logo-and-text" className="flex items-center">
          <div id="logo" className="mr-4">
          </div>
          <div className="flex flex-1 flex-col justify-center pt-4">
            <div className="text-center">
              <h1 className="text-3xl font-playfair text-accent">{name}</h1>

              <p className="text-lg text-gray-500">{motto}</p>
            </div>
            <div className="flex justify-center mt-4">
              <button
                className="bg-accent hover:bg-lightAccent text-dark font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => redirect('/login')}
              >
                Acessar
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}