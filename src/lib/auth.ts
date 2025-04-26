import { supabase } from './supabaseClient'; // Importa il client di Supabase

// Funzione per registrare un utente
export const register = async (username: string, email: string, password: string) => {
  try {
    // Creiamo un nuovo utente con email e password
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Errore nella registrazione:", error.message);
      return null; // In caso di errore, ritorniamo null
    }

    // Aggiungiamo lo username al profilo dell'utente
    const { error: updateError } = await supabase
      .from('utenti') // Assumendo che tu abbia una tabella utenti
      .update({ username: username })
      .eq('email', email);

    if (updateError) {
      console.error("Errore nell'aggiornare il profilo:", updateError.message);
      return null;
    }

    console.log("Utente registrato con successo", data);
    return data;
  } catch (error) {
    console.error("Errore nella registrazione:", error);
    return null;
  }
};

// Funzione per effettuare il login
export const login = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Errore login:", error.message);
      if (error.message === "Invalid login credentials") {
        alert("Le credenziali non sono valide o l'email non è confermata. Controlla la tua casella email per confermare.");
      }
      return null;
    }

    if (data && !data.user?.email_confirmed_at) {
      // L'email non è confermata
      alert("L'email non è confermata. Controlla la tua casella email per confermare.");
      return null;
    }

    return data;
  } catch (error) {
    console.error("Errore nel login:", error);
    return null;
  }
};
