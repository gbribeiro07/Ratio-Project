const RATIO_API_URL = import.meta.env.VITE_API_URL;

// Função de login de usuário
export async function loginUser(email, password) {
  try {
    const response = await fetch(`${RATIO_API_URL}/Login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erro no servidor ao tentar realizar login"
      );
    }

    return data;
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw new Error(error.message || "Não foi possível conectar ao servidor");
  }
}

// Atualização do token de acesso
export async function refreshAccessTokenUser() {
  try {
    const response = await fetch(`${RATIO_API_URL}/Refresh`, {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erro no servidor ao tentar atualizar o access token"
      );
    }

    return data;
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw new Error(error.message || "Não foi possível conectar ao servidor");
  }
}

// Função de logout de usuário
export async function logoutUser() {
  try {
    const response = await fetch(`${RATIO_API_URL}/Logout`, {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erro no servidor ao tentar atualizar o access token"
      );
    }

    return data;
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw new Error(error.message || "Não foi possível conectar ao servidor");
  }
}
