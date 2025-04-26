import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient"; // Assicurati che il percorso sia corretto

export default function ArchivioOrdini() {
  const [ordiniArchivio, setOrdiniArchivio] = useState<any[]>([]);

  useEffect(() => {
    const fetchArchivio = async () => {
      const { data, error } = await supabase.from("ordini_archiviati").select("*");
      if (error) {
        console.error("Errore nel caricare l'archivio ordini", error);
      } else {
        setOrdiniArchivio(data);
      }
    };

    fetchArchivio();
  }, []);

  return (
    <div>
      <h1>Archivio Ordini (Gestore)</h1>
      <ul>
        {ordiniArchivio.length > 0 ? (
          ordiniArchivio.map((ordine) => (
            <li key={ordine.id}>
              Ordine da {ordine.nome_cliente} - {ordine.prodotto_id} - {ordine.stato} - {ordine.data_ordine}
            </li>
          ))
        ) : (
          <p>Nessun ordine archiviato.</p>
        )}
      </ul>
    </div>
  );
}
