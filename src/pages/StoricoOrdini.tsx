import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient"; // Assicurati che il percorso sia corretto

export default function StoricoOrdini({ userEmail }: { userEmail: string }) {
  const [storicoOrdini, setStoricoOrdini] = useState<any[]>([]);

  useEffect(() => {
    const fetchStorico = async () => {
      const { data, error } = await supabase
        .from("ordini_archiviati")
        .select("*")
        .eq("email_cliente", userEmail);  // Filtra gli ordini in base all'email del cliente

      if (error) {
        console.error("Errore nel caricare lo storico ordini", error);
      } else {
        setStoricoOrdini(data);
      }
    };

    fetchStorico();
  }, [userEmail]);

  return (
    <div>
      <h1>Il Tuo Storico Ordini</h1>
      <ul>
        {storicoOrdini.length > 0 ? (
          storicoOrdini.map((ordine) => (
            <li key={ordine.id}>
              Ordine da {ordine.nome_cliente} - {ordine.prodotto_id} - {ordine.stato} - {ordine.data_ordine}
            </li>
          ))
        ) : (
          <p>Nessun ordine trovato.</p>
        )}
      </ul>
    </div>
  );
}
