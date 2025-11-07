const RATIO_API_URL = import.meta.env.VITE_API_URL;

export async function createGame(gameData) {
  try {
    const response = await fetch(`${RATIO_API_URL}/Jogo/Criar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gameData),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro no servidor ao criar o jogo.");
    }

    return data;
  } catch (error) {
    console.error("Erro na requisição createGame:", error);
    throw new Error(error.message || "Não foi possível conectar ao servidor.");
  }
}

export async function updatePreset(idGame, updates) {
  try {
    const response = await fetch(`${RATIO_API_URL}/Jogo/Atualizar/${idGame}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erro no servidor ao atualizar o Preset."
      );
    }

    return data;
  } catch (error) {
    console.error("Erro na requisição updatePreset:", error);
    throw new Error(error.message || "Não foi possível conectar ao servidor.");
  }
}

export async function deletePreset(idGame) {
  try {
    const response = await fetch(`${RATIO_API_URL}/Jogo/Deletar/${idGame}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro no servidor ao deletar o Preset.");
    }

    return data;
  } catch (error) {
    console.error("Erro na requisição deletePreset:", error);
    throw new Error(error.message || "Não foi possível conectar ao servidor.");
  }
}

export async function assignGameToProfiles(idGame, idProfiles) {
  try {
    const response = await fetch(`${RATIO_API_URL}/Jogo/Atribuir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idGame, idProfiles }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao atribuir o jogo aos perfis.");
    }

    return data;
  } catch (error) {
    console.error("Erro na requisição assignGameToProfiles:", error);
    throw new Error(error.message || "Não foi possível conectar ao servidor.");
  }
}

export async function listPresets() {
  try {
    const response = await fetch(`${RATIO_API_URL}/Jogo/Lista/Presets`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao listar Presets.");
    }

    return data;
  } catch (error) {
    console.error("Erro na requisição listPresets:", error);
    throw new Error(error.message || "Não foi possível conectar ao servidor.");
  }
}

export async function listAssignmentsByGame(idGame) {
  try {
    const response = await fetch(
      `${RATIO_API_URL}/Jogo/Lista/Atribuicoes/${idGame}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao listar atribuições do jogo.");
    }

    return data;
  } catch (error) {
    console.error("Erro na requisição listAssignmentsByGame:", error);
    throw new Error(error.message || "Não foi possível conectar ao servidor.");
  }
}
