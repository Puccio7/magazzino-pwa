import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const Verify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const email = searchParams.get("email"); // <== prendiamo anche email dall'URL

      if (!token || !email) {
        setError("Token o email mancanti.");
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        type: "email",
        token,
        email, // <== mandiamo email
      });

      if (error) {
        setError(error.message);
      } else {
        navigate("/login");
      }
    };

    verifyEmail();
  }, [navigate, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-green-500">Verifica in corso...</p>
      )}
    </div>
  );
};

export default Verify;
