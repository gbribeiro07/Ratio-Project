const RATIO_API_URL = import.meta.env.VITE_API_URL;

export async function listAssignedGames() {
  try {
    const response = await fetch(`${RATIO_API_URL}/Jogo/Lista/Atribuidos`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao listar jogos atribuídos.");
    }

    return data;
  } catch (error) {
    console.error("Erro na requisição listAssignedGames:", error);
    throw new Error(error.message || "Não foi possível conectar ao servidor.");
  }
}

export async function startOrResumeGame(idAssignment) {
  try {
    const response = await fetch(
      `${RATIO_API_URL}/Jogo/Iniciar/${idAssignment}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao iniciar/retomar o jogo.");
    }

    return data;
  } catch (error) {
    console.error("Erro na requisição startOrResumeGame:", error);
    throw new Error(error.message || "Não foi possível conectar ao servidor.");
  }
}

export async function submitAnswer(idAssignment, idGameQuestion, customAnswer) {
  try {
    const response = await fetch(`${RATIO_API_URL}/Jogo/Responder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idAssignment, idGameQuestion, customAnswer }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao enviar a resposta.");
    }

    return data;
  } catch (error) {
    console.error("Erro na requisição submitAnswer:", error);
    throw new Error(error.message || "Não foi possível conectar ao servidor.");
  }
}

export async function getRanking() {
  try {
    const response = await fetch(`${RATIO_API_URL}/Jogo/Ranking`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao buscar o Ranking.");
    }

    return data;
  } catch (error) {
    console.error("Erro na requisição getRanking:", error);
    throw new Error(error.message || "Não foi possível conectar ao servidor.");
  }
}
