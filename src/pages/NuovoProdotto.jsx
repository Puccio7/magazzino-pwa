import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function NuovoProdotto() {
  const [formData, setFormData] = useState({
    codice_prodotto: "",
    nome: "",
    descrizione: "",
    marca: "",
    categoria: "",
    prezzo: "",
    quantita: "",
    codice_ean: ""
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const { data, error } = await supabase
      .from('prodotti')
      .insert([formData]);
      
    if (error) alert('Errore: ' + error.message);
    else {
      alert('Prodotto aggiunto!');
      setFormData({
        codice_prodotto: "",
        nome: "",
        descrizione: "",
        marca: "",
        categoria: "",
        prezzo: "",
        quantita: "",
        codice_ean: ""
      });
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Aggiungi Prodotto</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="block capitalize">{key.replace('_', ' ')}</label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="border p-2 w-full"
              required={key !== 'descrizione' && key !== 'marca' && key !== 'categoria' && key !== 'codice_ean'}
            />
          </div>
        ))}
        
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Salva Prodotto
        </button>
      </form>
    </div>
  );
}
