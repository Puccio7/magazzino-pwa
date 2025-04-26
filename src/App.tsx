import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import Vetrina from "./pages/Vetrina";
import Magazzino from "./pages/Magazzino";
import Login from "./pages/Login";

function App() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setUser(data.session.user);
        getUserRole(data.session.user.id);
      } else {
        setUser(null);
        setRole(null);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        getUserRole(session.user.id);
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Funzione per recuperare il ruolo dell'utente
  const getUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('utenti')
      .select('ruolo')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Errore nel recuperare il ruolo:", error);
      setRole(null);
    } else {
      setRole(data?.ruolo ?? null);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Pagina principale Vetrina */}
        <Route path="/" element={<Vetrina />} />

        {/* Pagina Login */}
        <Route path="/login" element={<Login />} />

        {/* Rotta protetta per il Cliente */}
        <Route
          path="/vetrina"
          element={user ? <Vetrina /> : <Navigate to="/login" />}
        />

        {/* Rotta protetta per il Gestore */}
        <Route
          path="/magazzino"
          element={user && role === "gestore" ? <Magazzino /> : <Navigate to="/login" />}
        />

        {/* Qualsiasi altra rotta porta alla login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
