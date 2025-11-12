import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { getProfile } from "../../../Services/Profile.Api";
import ProfilesForm from "./ProfilesForm";

const PlusIcon = ({ size = 20, strokeWidth = 2.5 }) => (
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

const BlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  color: white;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  margin-top: 30px;
  margin-left: 10px;
  margin-bottom: 15px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  span {
    color: blueviolet;
  }

  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin-top: 20px;
    margin-left: 5px;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
    margin-top: 15px;
  }
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 10px;
  width: 96%;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    margin-bottom: 20px;
    padding: 0 5px;
    box-sizing: border-box;
  }
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: 10px 15px;
  background-color: #333333;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;
  &::placeholder {
    color: #999999;
  }
  &:focus {
    outline: 2px solid blueviolet;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 0.85rem;
  }
`;

const PlusButton = styled.button`
  padding: 8px;
  background-color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s;

  &:hover {
    background-color: blueviolet;
  }

  @media (max-width: 768px) {
    padding: 6px;
  }
`;

const CarouselWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  scroll-behavior: smooth;
  padding: 10px 0;
  gap: 15px;
  flex-grow: 1;
  max-width: 900px;
  width: 100%;
  height: 60vh;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: blueviolet;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background: #1a1a1a;
  }

  scrollbar-width: thin;
  scrollbar-color: blueviolet #1a1a1a;

  @media (max-width: 768px) {
    max-width: 100%;
    height: 50vh;
    gap: 15px;
  }
`;

const ProfilesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding-bottom: 20px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 15px;
  }
`;

const ProfileCard = styled.div`
  height: 160px;
  width: 280px;
  margin-left: 10px;
  margin-top: 10px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
  display: flex;
  align-items: flex-end;
  padding: 12px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
  font-size: 1.1rem;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    height: 140px;
    width: 100%;
    margin: 0;
    padding: 10px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    height: 120px;
  }
`;

const EXAMPLE_COLORS = [
  "#A30000",
  "#6C00FF",
  "#4C3B2F",
  "#FFFFFF",
  "#FF0000",
  "#CC6666",
  "#00994D",
  "#004D99",
];

export default function ProfilesBlock() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Função para carregar os perfis (chamada ao montar e ao criar um novo)
  const loadProfiles = async () => {
    try {
      setLoading(true);
      const response = await getProfile();

      const profilesWithColors = response.data.map((profile, index) => ({
        ...profile,
        color: EXAMPLE_COLORS[index % EXAMPLE_COLORS.length],
      }));

      setProfiles(profilesWithColors);
    } catch (err) {
      console.error("Erro ao buscar perfis:", err);
      setError(err.message || "Não foi possível carregar os perfis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  // Lógica de pesquisa (Filtro no Frontend pelo nome)
  const filteredProfiles = useMemo(() => {
    if (!searchTerm) return profiles;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return profiles.filter((profile) =>
      profile.nameProfile.toLowerCase().includes(lowerCaseSearch)
    );
  }, [profiles, searchTerm]);

  // Função de Ação do Cartão
  const handleProfileClick = (idProfile) => {
    console.log(`Perfil ID: ${idProfile} selecionado.`);
    localStorage.setItem("activeProfileId", idProfile);
    navigate("/Perfil");
  };

  // Função de Ação do Botão "+" (Abre o Modal)
  const handleCreateProfile = () => {
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Função para recarregar a lista após a criação bem-sucedida
  const handleProfileCreated = () => {
    loadProfiles();
  };

  return (
    <BlockContainer>
      {/* Título */}
      <Title>
        <span>Acesse</span> seus perfis
      </Title>

      {/* Barra de Pesquisa e Botão "+" */}
      <SearchBarContainer>
        <SearchInput
          type="text"
          placeholder="Pesquisar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <PlusButton
          onClick={handleCreateProfile}
          aria-label="Adicionar novo perfil"
        >
          <PlusIcon size={20} strokeWidth={3} />
        </PlusButton>
      </SearchBarContainer>

      {/* Carrossel Vertical (Scrollable Area) */}
      <CarouselWrapper>
        {loading && <p style={{ color: "#aaa" }}>Carregando perfis...</p>}

        {!loading && filteredProfiles.length === 0 && (
          <p style={{ color: "#aaa" }}>Nenhum perfil encontrado.</p>
        )}

        {/* Renderiza a grade de perfis */}
        <ProfilesGrid>
          {filteredProfiles.map((profile) => (
            <ProfileCard
              key={profile.idProfile}
              style={{
                backgroundColor: profile.color,
                color: profile.color === "#FFFFFF" ? "black" : "white",
              }}
              onClick={() => handleProfileClick(profile.idProfile)}
            >
              {profile.nameProfile}
            </ProfileCard>
          ))}
        </ProfilesGrid>
      </CarouselWrapper>

      {/* Renderiza o modal se estiver aberto */}
      {isModalOpen && (
        <ProfilesForm // Nome renomeado aqui
          onClose={handleCloseModal}
          onProfileCreated={handleProfileCreated}
        />
      )}
    </BlockContainer>
  );
}
