// /pages/page.tsx
import Link from 'next/link';


const Page = () => {
  return (
    <div className={`dashboard_main min-h-screen flex flex-col items-center justify-center  p-6`}>
      <div className="header text-center mb-8">
        <h1 className="text-3xl font-playfair text-accent">Troca Troca Menu</h1>
      </div>
      <div className="menu_buttons flex flex-col items-center justify-center gap-8">
        <Link href="/dashboard/receber">
          <button className="px-6 py-3 bg-green-500 text-white rounded-lg">Receber</button>
        </Link>
        <Link href="/dashboard/depositar">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg">Depositar</button>
        </Link>
        <Link href="/dashboard/saldo">
          <button className="px-6 py-3 bg-purple-500 text-white rounded-lg">Saldo</button>
        </Link>
      </div>
    </div>
  );
};

export default Page;
