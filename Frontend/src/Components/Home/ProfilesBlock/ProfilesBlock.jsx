import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { getProfile } from "../../../Services/Profile.Api";
import ProfilesForm from "./ProfilesForm";

// Ícone de Adição (usando um SVG simples como alternativa a bibliotecas)
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

const BlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  color: white;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  margin-top: 40px;
  margin-left: 10px;
  margin-bottom: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  span {
    color: blueviolet;
  }
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 10px;
  width: 96%;
  margin-bottom: 30px;
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
  background-color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s;

  &:hover {
    background-color: blueviolet;
  }
`;

// Contêiner principal do carrossel: Habilita o scroll vertical
const CarouselWrapper = styled.div`
  flex-grow: 1; /* Ocupa todo o espaço vertical restante */
  overflow-y: auto; /* Habilita o scroll vertical */
  padding-right: 15px; /* Espaço para a barra de scroll */

  /* Estilização da barra de rolagem (opcional, para navegadores WebKit como Chrome/Safari) */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #6c00ff; /* Cor roxa */
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: #222222;
  }
`;

// Grade para os perfis (2 colunas)
const ProfilesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 colunas de tamanho igual */
  gap: 20px;
  padding-bottom: 20px;
`;

// Componente do Cartão de Perfil
const ProfileCard = styled.div`
  height: 190px;
  width: 310px;
  margin-left: 10px;
  margin-top: 10px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
  display: flex;
  align-items: flex-end;
  padding: 15px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
  font-size: 1.2rem;

  &:hover {
    transform: scale(1.05);
  }
`;

// Cores de exemplo para simular os avatares (pode ser substituído pelo avatar real)
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
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para o Modal

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

  // Função de Ação do Cartão (Exemplo: Selecionar perfil)
  const handleProfileClick = (idProfile) => {
    console.log(`Perfil ID: ${idProfile} selecionado.`);
    // Lógica para definir o perfil ativo ou navegar para a dashboard do perfil
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
