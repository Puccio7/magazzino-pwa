import { supabase } from "./supabaseClient";

// Funzione per gestire il login e registrazione automatica
export const loginOrRegister = async (email: string, password: string) => {
  try {
    // Effettua il login
    const { data: session, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      console.error("Errore nel login:", loginError);
      return;
    }

    // Verifica se l'utente esiste già nel database
    const { data: existingUser, error: fetchError } = await supabase
      .from('utenti')
      .select('id, ruolo')
      .eq('email', email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Errore nel recuperare l'utente:", fetchError);
      return;
    }

    // Se l'utente non esiste, lo creiamo con il ruolo di 'cliente'
    if (!existingUser) {
      const { data: newUser, error: insertError } = await supabase
        .from('utenti')
        .insert([{ email, ruolo: 'cliente' }]);

      if (insertError) {
        console.error("Errore nel creare il nuovo utente:", insertError);
        return;
      }

      console.log("Nuovo utente creato:", newUser);
    } else {
      console.log("Utente esistente, ruolo:", existingUser.ruolo);
    }

    // Ora, continua con la logica di login o altre azioni
    return session;

  } catch (error) {
    console.error("Errore durante il login o la registrazione:", error);
  }
};
