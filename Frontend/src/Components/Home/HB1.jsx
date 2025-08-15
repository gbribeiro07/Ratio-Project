import styled from "styled-components";
import { useEffect, useState } from "react";
import { getUser } from "../../Services/User.Api";

const HB1Container = styled.div`
  background-color: #000000;
  display: flex;
  width: 101.05%;
  height: 1158px;
  margin-top: 0;
  margin-left: -8px;
  position: relative;
`;

const WelcomeMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  color: white;
  font-size: 3rem;
  font-weight: bold;
  text-align: left;
  max-width: 50%;
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
      <HB1Container>
        <div style={{ color: "white", margin: "auto" }}>Carregando...</div>
      </HB1Container>
    );
  }

  if (error) {
    return (
      <HB1Container>
        <div style={{ color: "white", margin: "auto" }}>{error}</div>
      </HB1Container>
    );
  }

  return (
    <HB1Container>
      {userData && (
        <WelcomeMessage>Bem-vindo, {userData.nameUser}!</WelcomeMessage>
      )}
    </HB1Container>
  );
}
