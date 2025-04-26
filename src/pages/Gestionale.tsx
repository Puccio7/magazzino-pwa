import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Prodotto = {
  id: string;
  codice_prodotto: string;
  nome: string;
  descrizione: string;
  prezzo: number;
};

type Ordine = {
  id: string;
  cliente_nome: string;
  prodotto_nome: string;
  created_at: string;
};

export default function Gestionale() {
  const [prodotti, setProdotti] = useState<Prodotto[]>([]);
  const [ordini, setOrdini] = useState<Ordine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Stato per nuovo prodotto
  const [nuovoProdotto, setNuovoProdotto] = useState({
    codice_prodotto: "",
    nome: "",
    descrizione: "",
    prezzo: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data: prodottiData } = await supabase.from("prodotti").select("*").order("nome", { ascending: true });
    const { data: ordiniData } = await supabase.from("ordini").select("*").order("created_at", { ascending: false });

    setProdotti(prodottiData || []);
    setOrdini(ordiniData || []);

    setLoading(false);
  };

  const aggiungiProdotto = async () => {
    const { codice_prodotto, nome, descrizione, prezzo } = nuovoProdotto;
    if (!codice_prodotto || !nome || !prezzo) return alert("Completa tutti i campi obbligatori.");

    const { error } = await supabase.from("prodotti").insert([
      {
        codice_prodotto,
        nome,
        descrizione,
        prezzo: parseFloat(prezzo),
      },
    ]);

    if (error) {
      console.error(error);
      alert("Errore nell'aggiunta prodotto.");
    } else {
      alert("Prodotto aggiunto!");
      setNuovoProdotto({ codice_prodotto: "", nome: "", descrizione: "", prezzo: "" });
      fetchData();
    }
  };

  const eliminaProdotto = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo prodotto?")) return;
    await supabase.from("prodotti").delete().eq("id", id);
    fetchData();
  };

  const eliminaOrdine = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo ordine?")) return;
    await supabase.from("ordini").delete().eq("id", id);
    fetchData();
  };

  if (loading) return <div className="p-10">Caricamento dati...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Area Gestionale</h1>

      {/* Sezione Aggiunta Prodotto */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-2xl font-semibold mb-4">Aggiungi Nuovo Prodotto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Codice Prodotto *"
            className="p-2 border rounded"
            value={nuovoProdotto.codice_prodotto}
            onChange={(e) => setNuovoProdotto({ ...nuovoProdotto, codice_prodotto: e.target.value })}
          />
          <input
            type="text"
            placeholder="Nome *"
            className="p-2 border rounded"
            value={nuovoProdotto.nome}
            onChange={(e) => setNuovoProdotto({ ...nuovoProdotto, nome: e.target.value })}
          />
          <input
            type="text"
            placeholder="Descrizione"
            className="p-2 border rounded"
            value={nuovoProdotto.descrizione}
            onChange={(e) => setNuovoProdotto({ ...nuovoProdotto, descrizione: e.target.value })}
          />
          <input
            type="number"
            placeholder="Prezzo (€) *"
            className="p-2 border rounded"
            value={nuovoProdotto.prezzo}
            onChange={(e) => setNuovoProdotto({ ...nuovoProdotto, prezzo: e.target.value })}
          />
        </div>
        <button
          onClick={aggiungiProdotto}
          className="mt-4 bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600"
        >
          Aggiungi Prodotto
        </button>
      </div>

      {/* Lista Prodotti */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Prodotti</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {prodotti.map((prodotto) => (
            <div key={prodotto.id} className="bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="font-bold">{prodotto.nome}</h3>
              <p className="text-gray-500">{prodotto.descrizione}</p>
              <p className="text-green-700 font-bold mt-1">{prodotto.prezzo.toFixed(2)} €</p>
              <button
                onClick={() => eliminaProdotto(prodotto.id)}
                className="mt-3 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
              >
                Elimina
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Lista Ordini */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Ordini Clienti</h2>
        {ordini.length === 0 ? (
          <p className="text-gray-500">Nessun ordine ricevuto.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {ordini.map((ordine) => (
              <div key={ordine.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <p className="font-bold">{ordine.prodotto_nome}</p>
                  <p className="text-gray-600">Cliente: {ordine.cliente_nome}</p>
                  <p className="text-gray-400 text-sm">{new Date(ordine.created_at).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => eliminaOrdine(ordine.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Elimina
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
