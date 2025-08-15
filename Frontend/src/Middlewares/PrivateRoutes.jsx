import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const RATIO_API_URL = import.meta.env.VITE_API_URL;

export default function PrivateRoute({ children }) {
  const [authStatus, setAuthStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        // Chama o endpoint Refresh para validar o token
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${RATIO_API_URL}/Refresh`, {
          method: "POST",
          credentials: "include",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`Erro ${response.status}`);

        if (isMounted) setAuthStatus("authenticated");
      } catch (error) {
        if (isMounted) {
          console.error("Falha na autenticação:", error);
          setAuthStatus("unauthenticated");
        }
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (authStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4">Verificando autenticação...</span>
      </div>
    );
  }

  // Redireciona para login se não autenticado
  return authStatus === "authenticated" ? (
    children
  ) : (
    <Navigate to="/Login" replace />
  );
}

PrivateRoute.propTypes = { children: PropTypes.node.isRequired };
