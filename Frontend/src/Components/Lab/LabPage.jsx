import styled from "styled-components";
import { useEffect, useState } from "react";
// import { getUser } from "../../Services/User.Api";
import GamesForm from "./GamesForm";
import PresetBlock from "./PresetBlock";
import PropTypes from "prop-types";

const GamesPageContainer = styled.div`
  background-color: #101010;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  font-family: "Georgia", serif;
`;

const TopBlock = styled.div`
  width: 100%;
  height: 50vh;
  padding: 40px;
  background-color: #101010;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const BottomBlock = styled.div`
  width: 100%;
  height: 50vh;
  padding: 40px;
  background-color: #101010;
  border-top: 1px solid #333;
  overflow-y: hidden;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 40px 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: white;

  span {
    color: blueviolet;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: 12px 18px;
  background-color: #333333;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  &::placeholder {
    color: #999999;
  }
  &:focus {
    outline: 2px solid blueviolet;
  }
`;

const PlusButton = styled.button`
  padding: 10px;
  background-color: #ffffff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: blueviolet;
    transform: scale(1.05);
  }
`;

const PlusIcon = ({ size = 24, strokeWidth = 3 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="black"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

PlusIcon.propTypes = {
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
};

export default function LabPage() {
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyToReloadPresets, setKeyToReloadPresets] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // const response = await getUser();
        // if (!response.success) { /* set error from response if needed */ }
      } catch {
        // handle connection error if needed
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleCreateGame = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleGameCreated = () => {
    setKeyToReloadPresets((prev) => prev + 1);
    handleCloseModal();
  };

  if (loading) {
    return (
      <GamesPageContainer>
        <div style={{ color: "white", margin: "auto" }}>Carregando...</div>
      </GamesPageContainer>
    );
  }

  if (error) {
    return (
      <GamesPageContainer>
        <div style={{ color: "white", margin: "auto" }}>{error}</div>
      </GamesPageContainer>
    );
  }

  return (
    <GamesPageContainer>
      {/* BLOCO DE CIMA: Título, Pesquisa e Botão '+' */}
      <TopBlock>
        <Title>
          Gestão de <span>Presets</span>
        </Title>

        <ControlsContainer>
          <SearchInput
            type="text"
            placeholder="Pesquisar Presets de Jogos"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <PlusButton
            onClick={handleCreateGame}
            aria-label="Criar novo jogo/preset"
          >
            <PlusIcon size={20} strokeWidth={3} />
          </PlusButton>
        </ControlsContainer>

        <p style={{ color: "#aaa" }}>
          Utilize a barra de pesquisa para filtrar rapidamente seus jogos
          pré-configurados.
        </p>
      </TopBlock>

      {/* BLOCO DE BAIXO: Carrossel de Presets */}
      <BottomBlock>
        <PresetBlock key={keyToReloadPresets} searchTerm={searchTerm} />
      </BottomBlock>

      {/* MODAL DE CRIAÇÃO DE JOGO */}
      {isModalOpen && (
        <GamesForm
          onClose={handleCloseModal}
          onGameCreated={handleGameCreated}
        />
      )}
    </GamesPageContainer>
  );
}
LabPage.propTypes = {
  size: PropTypes.func.isRequired,
  strokeWidth: PropTypes.func.isRequired,
};
