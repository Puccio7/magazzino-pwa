import { useState } from "react";
import { loginOrRegister } from "../lib/auth"; // Importa la funzione di login

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const session = await loginOrRegister(email, password);
    if (session) {
      // Successo nel login o registrazione
      console.log("Utente loggato correttamente", session);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Accedi</button>
      </form>
    </div>
  );
};

export default Login;
