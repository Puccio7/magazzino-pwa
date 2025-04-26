import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Le password non coincidono.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    if (!data.user) {
      setError("Errore nella registrazione.");
      return;
    }

    // Inserisci utente anche nella tabella 'utenti' per assegnargli un ruolo (default 'utente')
    const { error: insertError } = await supabase.from("utenti").insert([
      {
        id: data.user.id,
        ruolo: "utente",
      },
    ]);

    if (insertError) {
      setError("Errore nel salvataggio dei dati utente.");
      return;
    }

    // Registrazione avvenuta: manda al login
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Registrati</h1>

      <form onSubmit={handleRegister} className="flex flex-col gap-4 w-80">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Conferma Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
          Registrati
        </button>

        {error && <p className="text-red-500">{error}</p>}

        {/* Link per tornare al login */}
        <p className="text-center mt-4">
          Hai già un account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Accedi
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
