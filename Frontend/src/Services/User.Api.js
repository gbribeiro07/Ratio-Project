const RATIO_API_URL = import.meta.env.VITE_API_URL;

// Função para cadastrar um usuário
export async function registerUser(nameUser, email, password) {
  try {
    const response = await fetch(`${RATIO_API_URL}/Cadastro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameUser, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro no servidor ao cadastrar");
    }

    return data;
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw new Error(error.message || "Não foi possível conectar ao servidor");
  }
}

// Verificação do código enviado por e-mail
export async function verifyEmailUser(email, VerificationCode) {
  const response = await fetch(`${RATIO_API_URL}/Verificar-Email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, VerificationCode }),
  });

  return response.json();
}

// Verificação do código enviado por e-mail
export async function getUser() {
  try {
    const response = await fetch(`${RATIO_API_URL}/UserBasics`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      } else if (response.status === 404) {
        throw new Error(data.message || "Usuário não encontrado!");
      } else {
        throw new Error(data.message || "Erro no servidor.");
      }
    }

    return data;
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw new Error(error.message || "Não foi possível conectar ao servidor");
  }
}
