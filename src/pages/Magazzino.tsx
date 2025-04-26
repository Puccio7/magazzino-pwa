import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const Magazzino = () => {
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
    <div>
      <h1>Gestione Magazzino</h1>
      <form onSubmit={handleAggiungiProdotto}>
        <input type="text" name="nome" placeholder="Nome prodotto" required />
        <input
          type="text"
          name="descrizione"
          placeholder="Descrizione prodotto"
          required
        />
        <input
          type="number"
          name="prezzo"
          placeholder="Prezzo prodotto"
          required
        />
        <input
          type="number"
          name="disponibilita"
          placeholder="Disponibilità prodotto"
          required
        />
        <button type="submit">Aggiungi Prodotto</button>
      </form>

      <div>
        <ul>
          {prodotti.map((prodotto, index) => (
            <li key={index}>
              <p>{prodotto.nome}</p>
              <p>{prodotto.descrizione}</p>
              <p>€{prodotto.prezzo}</p>
              <p>{prodotto.disponibilita}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Magazzino;
