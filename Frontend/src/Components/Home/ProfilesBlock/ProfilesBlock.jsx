import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { getProfile, deleteProfile } from "../../../Services/Profile.Api";
import ProfilesForm from "./ProfilesForm";
import editarIcon from "../../../assets/editar-icon.png";
import lixeiraIcon from "../../../assets/lixeira-icon.png";

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
  position: relative;
  overflow: hidden;
  background: ${(props) =>
    props.$hasAvatar ? "transparent" : props.$backgroundColor};
  color: ${(props) =>
    props.$hasAvatar
      ? "white"
      : props.$backgroundColor === "#FFFFFF"
      ? "black"
      : "white"};

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

const ProfileBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.$avatarUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      transparent 50%,
      rgba(0, 0, 0, 0.7) 100%
    );
    z-index: 2;
  }
`;

// Container para o nome do perfil (sobre a imagem)
const ProfileName = styled.div`
  position: relative;
  z-index: 3;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
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

// Container para os botões de ação
const ProfileActions = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
  z-index: 4;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${ProfileCard}:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    opacity: 1; // Sempre visível em mobile
  }
`;

// Botão de ação
const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);

  &:hover {
    transform: scale(1.1);
    background: rgba(0, 0, 0, 0.9);
  }

  &:active {
    transform: scale(0.95);
  }
`;

// Ícone dos botões
const ActionIcon = styled.img`
  width: 16px;
  height: 16px;
  filter: invert(1);
`;

// Modal de confirmação de exclusão
const DeleteModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DeleteModalContent = styled.div`
  background: linear-gradient(145deg, #2c2724, #1f1b18);
  padding: 30px;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  text-align: center;
  color: #f0f0f0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const DeleteTitle = styled.h3`
  color: #ff6b6b;
  margin-bottom: 15px;
`;

const DeleteText = styled.p`
  margin-bottom: 25px;
  line-height: 1.5;
`;

const DeleteButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background: #4a4440;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #5a5450;
  }
`;

const ConfirmDeleteButton = styled.button`
  padding: 10px 20px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #cc0000;
  }
`;

export default function ProfilesBlock() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [, setMessage] = useState(null);
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

  // Função para abrir modal de edição
  const handleEditProfile = (profile, event) => {
    event.stopPropagation(); // Impede o clique no card
    setSelectedProfile(profile);
    setIsEditModalOpen(true);
  };

  // Função para abrir modal de exclusão
  const handleDeleteProfile = (profile, event) => {
    event.stopPropagation(); // Impede o clique no card
    setSelectedProfile(profile);
    setIsDeleteModalOpen(true);
  };

  // Função para confirmar exclusão
  const handleConfirmDelete = async () => {
    if (!selectedProfile) return;

    try {
      await deleteProfile(selectedProfile.idProfile);
      setMessage({ text: "Perfil excluído com sucesso!", error: false });
      loadProfiles(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao excluir perfil:", error);
      setMessage({
        text: error.message || "Erro ao excluir perfil",
        error: true,
      });
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedProfile(null);
    }
  };

  // Função para fechar modais
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProfile(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProfile(null);
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
              $backgroundColor={profile.color}
              $hasAvatar={!!profile.avatar}
              onClick={() => handleProfileClick(profile.idProfile)}
            >
              {profile.avatar && (
                <ProfileBackground $avatarUrl={profile.avatar} />
              )}

              <ProfileActions>
                <ActionButton
                  onClick={(e) => handleEditProfile(profile, e)}
                  title="Editar perfil"
                >
                  <ActionIcon src={editarIcon} alt="Editar" />
                </ActionButton>
                <ActionButton
                  onClick={(e) => handleDeleteProfile(profile, e)}
                  title="Excluir perfil"
                >
                  <ActionIcon src={lixeiraIcon} alt="Excluir" />
                </ActionButton>
              </ProfileActions>
              <ProfileName>
                {profile.nameProfile}
                {profile.age && ` | ${profile.age} anos`}
              </ProfileName>
            </ProfileCard>
          ))}
        </ProfilesGrid>
      </CarouselWrapper>

      {/* Renderiza o modal se estiver aberto */}
      {isModalOpen && (
        <ProfilesForm
          onClose={handleCloseModal}
          onProfileCreated={handleProfileCreated}
          profileToEdit={selectedProfile}
        />
      )}

      {isEditModalOpen && selectedProfile && (
        <ProfilesForm
          onClose={handleCloseEditModal}
          onProfileCreated={handleProfileCreated}
          profileToEdit={selectedProfile} // Passa o perfil para edição
        />
      )}

      {/* Modal de confirmação de exclusão */}
      {isDeleteModalOpen && selectedProfile && (
        <DeleteModal onClick={handleCloseDeleteModal}>
          <DeleteModalContent onClick={(e) => e.stopPropagation()}>
            <DeleteTitle>⚠️ Excluir Perfil</DeleteTitle>
            <DeleteText>
              {`Tem certeza que deseja excluir o perfil "${selectedProfile.nameProfile}"?`}
              <br />
              Esta ação não pode ser desfeita.
            </DeleteText>
            <DeleteButtons>
              <CancelButton onClick={handleCloseDeleteModal}>
                Cancelar
              </CancelButton>
              <ConfirmDeleteButton onClick={handleConfirmDelete}>
                Excluir
              </ConfirmDeleteButton>
            </DeleteButtons>
          </DeleteModalContent>
        </DeleteModal>
      )}
    </BlockContainer>
  );
}
