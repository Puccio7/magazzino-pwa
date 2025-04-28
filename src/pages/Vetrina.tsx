import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const Vetrina = () => {
  const [prodotti, setProdotti] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData);
    };

    const fetchProdotti = async () => {
      const { data, error } = await supabase.from("prodotti").select("*");

      if (error) {
        console.error("Errore nel recupero dei prodotti:", error);
      } else {
        setProdotti(data);
      }
    };

    fetchUser();
    fetchProdotti();

  }, []);

  const aggiungiAlCarrello = async (prodotto: any) => {
    if (!user) {
      console.error("Devi essere loggato per aggiungere un prodotto al carrello");
      return;
    }

    const { error } = await supabase.from("carrello").insert([
      {
        prodotto_id: prodotto.id,
        prodotto_nome: prodotto.nome,
        cliente_nome: user.email,
        quantita: 1,
        utente_id: user.id,
      },
    ]);

    if (error) {
      console.error("Errore nell'aggiungere il prodotto al carrello:", error);
    } else {
      console.log("Prodotto aggiunto al carrello!");
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Errore durante il logout:", error);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem',
      backgroundColor: 'white',
    }}>
      {/* Header con pulsanti logout e carrello */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '0.5rem 0',
        borderBottom: '1px solid #e5e7eb'
      }}>
        {/* Pulsante Logout */}
        <button 
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span style={{ marginLeft: '0.5rem' }}>Logout</span>
        </button>

        {/* Titolo centrale */}
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#111827',
          margin: '0'
        }}>
          Prodotti disponibili
        </h1>

        {/* Pulsante Carrello */}
        <button 
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span style={{ marginLeft: '0.5rem' }}>Carrello</span>
        </button>
      </div>

      {/* Grid di prodotti (3 per riga) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {prodotti.length > 0 ? (
          prodotti.map((prodotto) => (
            <div 
              key={prodotto.id} 
              style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              {/* Immagine del prodotto */}
              <div style={{
                height: '180px',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {prodotto.immagine ? (
                  <img 
                    src={prodotto.immagine} 
                    alt={prodotto.nome}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  <div style={{
                    color: '#9ca3af',
                    fontSize: '0.875rem'
                  }}>
                    Immagine non disponibile
                  </div>
                )}
              </div>

              {/* Informazioni prodotto */}
              <div style={{
                padding: '1rem',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h2 style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginTop: '0',
                  marginBottom: '0.5rem'
                }}>
                  {prodotto.nome}
                </h2>
                
                <p style={{
                  fontSize: '0.875rem',
                  color: '#4b5563',
                  marginBottom: '1rem',
                  flexGrow: 1
                }}>
                  {prodotto.descrizione}
                </p>
                
                {/* Footer con prezzo e pulsante */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'auto'
                }}>
                  <button
                    onClick={() => aggiungiAlCarrello(prodotto)}
                    style={{
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    Aggiungi
                  </button>
                  
                  <p style={{
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    color: '#111827',
                    margin: '0'
                  }}>
                    €{prodotto.prezzo}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '2rem',
            color: '#6b7280'
          }}>
            Non ci sono prodotti disponibili al momento.
          </p>
        )}
      </div>
    </div>
  );
};

export default Vetrina;
