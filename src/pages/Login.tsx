import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // aggiunto Link!
import { supabase } from "../lib/supabaseClient";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    if (!data?.user?.email_confirmed_at) {
      setError("Conferma prima l'email!");
      return;
    }

    // Prendi il ruolo
    const { data: userData, error: userError } = await supabase
      .from("utenti")
      .select("ruolo")
      .eq("id", data.user.id)
      .single();

    if (userError || !userData) {
      setError("Impossibile recuperare il ruolo utente.");
      return;
    }

    if (userData.ruolo === "gestore") {
      navigate("/magazzino");
    } else {
      navigate("/vetrina");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Accedi</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
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
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
          Accedi
        </button>

        {error && <p className="text-red-500">{error}</p>}

        {/* Qui aggiungiamo il link */}
        <p className="text-center mt-4">
          Non hai un account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Registrati
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
