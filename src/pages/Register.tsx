import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("Errore nella registrazione:", error);
    } else {
      console.log("Utente registrato:", user);
    }
  };

  return (
    // Questi stili sovrascrivono completamente il layout di App.css
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
        
        <form onSubmit={handleSubmit} style={{marginBottom: '1.5rem'}}>
          <div style={{marginBottom: '1rem'}}>
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
          
          <div style={{marginBottom: '1rem'}}>
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
              transition: 'background-color 0.2s',
              marginTop: '1rem'
            }}
          >
            Registrati
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
            Hai già un account? <Link to="/login" style={{color: '#3b82f6', fontWeight: '500'}}>Accedi</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
