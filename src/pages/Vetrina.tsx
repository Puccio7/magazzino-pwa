import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const Vetrina = () => {
  const [prodotti, setProdotti] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProdotti = async () => {
      const { data, error } = await supabase.from("prodotti").select("*");
      if (data) {
        setProdotti(data);
      } else {
        console.error("Errore nel recuperare i prodotti", error);
      }
      setLoading(false);
    };

    fetchProdotti();
  }, []);

  return (
    <div>
      <h1>Vetrina</h1>
      {loading ? (
        <p>Caricamento...</p>
      ) : (
        <ul>
          {prodotti.length > 0 ? (
            prodotti.map((prodotto, index) => (
              <li key={index}>
                <p>{prodotto.nome}</p>
                <p>{prodotto.descrizione}</p>
                <p>€{prodotto.prezzo}</p>
              </li>
            ))
          ) : (
            <p>Nessun prodotto disponibile.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Vetrina;
