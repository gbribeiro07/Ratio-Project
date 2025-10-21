import styled from "styled-components";
import { useEffect, useState } from "react";
import { getUser } from "../../Services/User.Api";
import ProfilesBlock from "./ProfilesBlock";

const HomeContainer = styled.div`
  background-color: #181818;
  display: flex;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  font-family: "Georgia", serif;
`;

// Bloco da esquerda (Perfis) - 50% da largura
const LeftBlock = styled.div`
  width: 50%;
  height: 100%;
  padding: 40px;
  background-color: #181818;
`;

// Bloco da direita (Ranking) - 50% da largura
const RightBlock = styled.div`
  width: 50%;
  height: 100%;
  padding: 40px;
  /* Este será o contêiner que receberá a div branca do ranking */
`;

export default function HB1() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // A busca de dados do usuário permanece aqui, pois ProfilesBlock e RankingBlock podem precisar deles
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUser();
        if (response.success) {
          setUserData(response.data);
        } else {
          setError(response.message || "Erro ao carregar dados do usuário");
        }
      } catch (err) {
        setError(err.message || "Erro na conexão com o servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <HomeContainer>
        <div style={{ color: "white", margin: "auto" }}>Carregando...</div>
      </HomeContainer>
    );
  }

  if (error) {
    return (
      <HomeContainer>
        <div style={{ color: "white", margin: "auto" }}>{error}</div>
      </HomeContainer>
    );
  }

  // Retorna a estrutura 50/50 com o Bloco dos Perfis implementado
  return (
    <HomeContainer>
      <LeftBlock>
        {/* Passamos o nome do usuário para ProfilesBlock, caso seja necessário */}
        <ProfilesBlock userName={userData?.nameUser} />
      </LeftBlock>

      <RightBlock>
        {/* Futuro Bloco do Ranking (div branca) */}
        <div
          style={{
            backgroundColor: "white",
            height: "100%",
            borderRadius: "15px",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* O conteúdo do ranking será inserido aqui */}
        </div>
      </RightBlock>
    </HomeContainer>
  );
}
