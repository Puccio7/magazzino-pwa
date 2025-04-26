import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const Vetrina = ({ logout }: { logout: () => void }) => {
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
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vetrina</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Caricamento...</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prodotti.length > 0 ? (
            prodotti.map((prodotto, index) => (
              <li key={index} className="border p-4 rounded shadow">
                <p className="text-xl font-semibold">{prodotto.nome}</p>
                <p className="text-gray-600">{prodotto.descrizione}</p>
                <p className="text-green-600 font-bold mt-2">
                  €{parseFloat(prodotto.prezzo).toFixed(2)}
                </p>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">Nessun prodotto disponibile.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Vetrina;
