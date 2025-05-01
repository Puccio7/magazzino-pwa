import { useState } from "react";
import  supabase  from "../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";  // Usa useNavigate al posto di useHistory
import logo from "../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<{ type: 'error' | 'warning' | 'success'; message: string } | null>(null);
  const navigate = useNavigate();  // Inizializza useNavigate per la navigazione

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Errore nel login:", error);
      setAlert({
        type: 'error',
        message: "Errore di accesso. Verifica email e password."
      });
      return;
    }

    console.log("Login riuscito:", data.user);
    setAlert(null);

    const userId = data.user?.id;
    const userEmail = data.user?.email;

    if (!userId || !userEmail) {
      console.error("Dati utente mancanti");
      return;
    }

    // Prova subito ad inserire l'utente nella tabella
    const { error: insertError } = await supabase.from("utentiNew").insert([  // Assicurati che la tabella si chiami "utentiNew"
      {
        auth_id: userId,    // testo copia dell'UUID
        email: userEmail,
        nome: userEmail,
        ruolo: 'cliente',
      },
    ]);

    if (insertError) {
      if (insertError.code === '23505') { 
        // 23505 è il codice di errore 'unique violation' di Postgres
        console.warn("Utente già presente, nessun problema.");
      } else {
        console.error("Errore nell'inserimento nella tabella utenti:", insertError.message);
      }
    } else {
      console.log("Utente inserito correttamente nella tabella utenti!");
    }

    // Dopo il login e l'inserimento, reindirizza alla pagina desiderata (per esempio la home)
    navigate("/vetrina"); // Reindirizzamento a vetrina (o qualsiasi altra pagina tu preferisca)
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      margin: 0,
      padding: 0
    }}>
      {/* Card con bordo sottile e larghezza controllata */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        {/* Logo centrato e piccolo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <img 
            src={logo} 
            alt="elettroemporio-chiusi s.r.l." 
            style={{
              height: '40px',
              maxWidth: '100%',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Alert/Pop-up notification */}
        {alert && (
          <div 
            style={{
              padding: '0.75rem',
              marginBottom: '1rem',
              borderRadius: '0.25rem',
              backgroundColor: alert.type === 'error' ? '#fee2e2' : 
                              alert.type === 'warning' ? '#fff7ed' : '#ecfdf5',
              color: alert.type === 'error' ? '#b91c1c' : 
                      alert.type === 'warning' ? '#9a3412' : '#065f46',
              border: `1px solid ${alert.type === 'error' ? '#fecaca' : 
                                  alert.type === 'warning' ? '#fed7aa' : '#a7f3d0'}`,
              display: 'flex',
              alignItems: 'flex-start',
              position: 'relative'
            }}
          >
            {/* Close button */}
            <button 
              onClick={() => setAlert(null)}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                color: 'inherit'
              }}
            >
              &times;
            </button>
            
            {/* Alert content */}
            <div style={{ marginRight: '1.5rem' }}>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                {alert.message}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="email" 
              style={{
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#4b5563',
                textAlign: 'left',
                marginBottom: '0.25rem'
              }}
            >
              EMAIL:
            </label>
            <input
              id="email"
              type="email"
              placeholder="Inserisci qui la tua email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="password" 
              style={{
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#4b5563',
                textAlign: 'left',
                marginBottom: '0.25rem'
              }}
            >
              PASSWORD:
            </label>
            <input
              id="password"
              type="password"
              placeholder="Inserisci qui la tua password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{
            textAlign: 'right',
            marginBottom: '1rem'
          }}>
            <span style={{
              fontSize: '0.875rem',
              color: '#3b82f6',
              cursor: 'pointer'
            }}>
              Password dimenticata?
            </span>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              borderRadius: '0.25rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Accedi
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '1rem'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            Non hai un account? <Link to="/register" style={{ color: '#3b82f6', fontWeight: '500' }}>Registrati</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
