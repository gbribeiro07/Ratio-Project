const RATIO_API_URL = import.meta.env.VITE_API_URL;

// Função para cadastrar um usuário
export async function registerUser(nameUser, email, password) {
  const response = await fetch(`${RATIO_API_URL}/Cadastro`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nameUser, email, password }),
  });

  return response.json();
}
