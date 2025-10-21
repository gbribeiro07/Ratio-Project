const RATIO_API_URL = import.meta.env.VITE_API_URL;

// Função para cadastrar um perfil
export async function registerProfile(nameProfile, age, avatar) {
  try {
    const response = await fetch(`${RATIO_API_URL}/Cadastro/Perfil`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameProfile, age, avatar }),
      credentials: "include",
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

// Função para obter perfis
export async function getProfile() {
  try {
    const response = await fetch(`${RATIO_API_URL}/Lista/Perfis`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro no servidor ao cadastrar perfil.");
    }

    return data;
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw new Error(error.message || "Não foi possível conectar ao servidor");
  }
}

// Função para deletar perfis
export async function deleteProfile(idProfile) {
  try {
    const response = await fetch(
      `${RATIO_API_URL}/Deletar/Perfil/${idProfile}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro no servidor ao deletar perfil.");
    }

    return data;
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw new Error(error.message || "Não foi possível conectar ao servidor");
  }
}

// Função para editar perfis
export async function updateProfile(idProfile, updates) {
  try {
    const response = await fetch(
      `${RATIO_API_URL}/Atualizar/Perfil/${idProfile}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro no servidor ao editar perfil.");
    }

    return data;
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw new Error(error.message || "Não foi possível conectar ao servidor");
  }
}
