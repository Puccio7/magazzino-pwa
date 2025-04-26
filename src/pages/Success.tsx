import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Email Confermata!</h1>
      <p className="text-lg mb-8">Ora puoi accedere al tuo account.</p>
      <button 
        onClick={handleGoToLogin} 
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-md transition"
      >
        Torna al Login
      </button>
    </div>
  );
}
