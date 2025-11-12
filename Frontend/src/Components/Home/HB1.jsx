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

  @media (max-width: 1024px) {
    min-height: 400px;
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
        <RankingWrapper></RankingWrapper>
      </RightBlock>
    </HomeContainer>
  );
}
