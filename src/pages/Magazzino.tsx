import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const Magazzino = ({ logout }: { logout: () => void }) => {
  const [prodotti, setProdotti] = useState<any[]>([]);

  const handleAggiungiProdotto = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const nome = (form.nome as HTMLInputElement).value;
    const descrizione = (form.descrizione as HTMLInputElement).value;
    const prezzo = parseFloat((form.prezzo as HTMLInputElement).value);
    const disponibilita = parseInt((form.disponibilita as HTMLInputElement).value, 10);

    const prodotto = {
      nome,
      descrizione,
      prezzo,
      disponibilita,
    };

    const { error } = await supabase.from("prodotti").insert([prodotto]);
    if (error) {
      console.log("Errore nell'inserire il prodotto", error);
    } else {
      setProdotti([...prodotti, prodotto]);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestione Magazzino</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleAggiungiProdotto} className="space-y-4">
        <input type="text" name="nome" placeholder="Nome prodotto" required className="border p-2 w-full" />
        <input type="text" name="descrizione" placeholder="Descrizione prodotto" required className="border p-2 w-full" />
        <input type="number" name="prezzo" placeholder="Prezzo prodotto" required className="border p-2 w-full" />
        <input type="number" name="disponibilita" placeholder="Disponibilità prodotto" required className="border p-2 w-full" />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Aggiungi Prodotto
        </button>
      </form>

      <div className="mt-8">
        <ul className="space-y-4">
          {prodotti.map((prodotto, index) => (
            <li key={index} className="border p-4 rounded">
              <p><strong>Nome:</strong> {prodotto.nome}</p>
              <p><strong>Descrizione:</strong> {prodotto.descrizione}</p>
              <p><strong>Prezzo:</strong> €{prodotto.prezzo.toFixed(2)}</p>
              <p><strong>Disponibilità:</strong> {prodotto.disponibilita}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Magazzino;
