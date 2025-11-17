import styled from "styled-components";
import { useEffect, useState } from "react";
import { getUser } from "../../Services/User.Api";
import ProfilesBlock from "./ProfilesBlock/ProfilesBlock";

const HomeContainer = styled.div`
  background-color: #101010;
  display: flex;
  height: 100vh;
  width: 100%;
  margin: 0;
  font-family: "Georgia", serif;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
  }
`;

const BlockBase = styled.div`
  padding: 40px;
  background-color: #101010;
  box-sizing: border-box;
  height: 100%;

  @media (max-width: 1024px) {
    width: 100%;
    min-height: 50vh;
    height: auto;
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const LeftBlock = styled(BlockBase)`
  width: 50%;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const RightBlock = styled(BlockBase)`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const RankingWrapper = styled.div`
  background-color: white;
  margin-left: 20px;
  height: 100%;
  width: 600px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  padding: 40px;
  text-align: center;
  overflow-y: auto;

  h1 {
    font-size: 2.5rem;
    font-weight: 900;
    margin-bottom: 0;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }

  h1 span {
    color: #d4a017; /* dourado */
  }

  h2 {
    font-size: 1.3rem;
    margin-top: 5px;
    font-weight: 800;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }

  ol {
    list-style: none;
    padding: 0;
    margin-top: 30px;
    text-align: left;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }

  li {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 10px;
    color: black;
  }

  span {
    font-weight: 900;
  }

  /* Cores conforme o desempenho */
  li:nth-child(1) span {
    color: #d4a017;
  }
  li:nth-child(2) span {
    color: #d4a017;
  }
  li:nth-child(3) span {
    color: #d4a017;
  }
  li:nth-child(4) span {
    color: #e63946;
  }
  li:nth-child(5) span {
    color: #e63946;
  }
  li:nth-child(6) span {
    color: #e63946;
  }
  li:nth-child(7) span {
    color: #e63946;
  }
  li:nth-child(8) span {
    color: #e63946;
  }
  li:nth-child(9) span {
    color: #e63946;
  }
  li:nth-child(10) span {
    color: #e63946;
  }

  @media (max-width: 1024px) {
    width: 90%;
    height: auto;
    margin-left: 0;
    margin-top: 20px;
  }

  @media (max-width: 480px) {
    padding: 25px;
    h1 {
      font-size: 2rem;
    }
    h2 {
      font-size: 1rem;
    }
    li {
      font-size: 1rem;
    }
  }
`;

export default function HB1() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <HomeContainer style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ color: "white" }}>Carregando...</div>
      </HomeContainer>
    );
  }

  if (error) {
    return (
      <HomeContainer style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ color: "white" }}>{error}</div>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <LeftBlock>
        <ProfilesBlock userName={userData?.nameUser} />
      </LeftBlock>

      <RightBlock>
        <RankingWrapper>
          <h1>
            <span>Ranking</span> de desempenho (Exemplo)
          </h1>
          <h2>(TOP 10)</h2>
          <ol>
            <li>
              1. Gabriel Almeida | <span>98% de acerto</span>
            </li>
            <li>
              2. Pedro | <span>80% de acerto</span>
            </li>
            <li>
              3. Felipe | <span>70% de acerto</span>
            </li>
            <li>
              4. Guilherme | <span>65% de acerto</span>
            </li>
            <li>
              5. Leonardo | <span>60% de acerto</span>
            </li>
            <li>
              6. Paulo | <span>55% de acerto</span>
            </li>
          </ol>
        </RankingWrapper>
      </RightBlock>
    </HomeContainer>
  );
}
