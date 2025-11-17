import styled from "styled-components";
import { useState, useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { getPresets, deletePreset } from "../../Services/Games/GameContent.Api";
// import editarIcon from "../../../assets/editar-icon.png";
import lixeiraIcon from "../../assets/lixeira-icon.png";

const ArrowIcon = ({ size = 24, direction = "right" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: direction === "left" ? "rotate(180deg)" : "none" }}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

ArrowIcon.propTypes = {
  size: PropTypes.number,
  direction: PropTypes.oneOf(["left", "right"]),
};

const BlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  color: white;
`;

const CarouselArea = styled.div`
  position: relative;
  flex-grow: 1;
  display: flex;
  align-items: center;
`;

const CarouselWrapper = styled.div`
  display: flex;
  overflow-x: scroll;
  scroll-behavior: smooth;
  padding: 10px 0;
  gap: 20px;
  flex-grow: 1;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const PresetCard = styled.div`
  flex: 0 0 250px;
  height: 150px;
  border-radius: 12px;
  background-color: #2c2724;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: transform 0.2s;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-left: 5px solid #6c00ff;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardTitle = styled.h4`
  font-size: 1.2rem;
  margin: 0;
  color: #f0f0f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardInfo = styled.p`
  font-size: 0.85rem;
  color: #cccccc;
  margin: 5px 0 0;
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  ${(props) => (props.direction === "left" ? "left: -15px;" : "right: -15px;")}
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background-color 0.2s;

  &:hover {
    background-color: #6c00ff;
  }
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

// Container para os botões de ação
const PresetActions = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
  z-index: 4;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${PresetCard}:hover & {
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

export default function PresetBlock({ searchTerm }) {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [, setMessage] = useState(null);
  const carouselRef = useRef(null);

  const loadPresets = async () => {
    try {
      setLoading(true);
      const response = await getPresets();

      if (response.success && Array.isArray(response.data)) {
        setPresets(response.data);
      } else {
        setPresets([]);
      }
    } catch (err) {
      console.error("Erro ao buscar presets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPresets();
  }, []);

  const filteredPresets = useMemo(() => {
    if (!searchTerm) return presets;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return presets.filter((preset) =>
      preset.namePreset.toLowerCase().includes(lowerCaseSearch)
    );
  }, [presets, searchTerm]);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Função para abrir modal de exclusão
  const handleDeletePreset = (preset, event) => {
    event.stopPropagation(); // Impede o clique no card
    setSelectedPreset(preset);
    setIsDeleteModalOpen(true);
  };

  // Função para confirmar exclusão
  const handleConfirmDelete = async () => {
    if (!selectedPreset) return;

    try {
      await deletePreset(selectedPreset.idGame);
      setMessage({ text: "Perfil excluído com sucesso!", error: false });
      loadPresets(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao excluir preset:", error);
      setMessage({
        text: error.message || "Erro ao excluir preset",
        error: true,
      });
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedPreset(null);
    }
  };

  // Função para fechar modais
  // const handleCloseEditModal = () => {
  //   setIsEditModalOpen(false);
  //   setSelectedPreset(null);
  // };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPreset(null);
  };

  return (
    <BlockContainer>
      <CarouselArea>
        <NavButton direction="left" onClick={() => scroll("left")}>
          <ArrowIcon direction="left" />
        </NavButton>

        <CarouselWrapper ref={carouselRef}>
          {loading && <p style={{ color: "#aaa" }}>Carregando presets...</p>}

          {!loading && filteredPresets.length === 0 && (
            <p style={{ color: "#aaa" }}>
              {searchTerm
                ? `Nenhum preset encontrado para "${searchTerm}".`
                : "Nenhum preset encontrado."}
            </p>
          )}

          {filteredPresets.map((preset) => (
            <PresetCard
              key={preset.idGame}
              onClick={() =>
                console.log(`Preset ID: ${preset.idGame} selecionado.`)
              }
            >
              <div>
                <CardTitle>{preset.namePreset}</CardTitle>
                <CardInfo>Tipo: {preset.nameGame}</CardInfo>
              </div>
              <CardInfo>Fases: {preset.totalPhases}</CardInfo>
              <PresetActions>
                {/* <ActionButton
                                onClick={(e) => handleEditProfile(profile, e)}
                                title="Editar perfil"
                              >
                                <ActionIcon src={editarIcon} alt="Editar" />
                              </ActionButton> */}
                <ActionButton
                  onClick={(e) => handleDeletePreset(preset, e)}
                  title="Excluir preset"
                >
                  <ActionIcon src={lixeiraIcon} alt="Excluir" />
                </ActionButton>
              </PresetActions>
            </PresetCard>
          ))}
        </CarouselWrapper>

        {isDeleteModalOpen && selectedPreset && (
          <DeleteModal onClick={handleCloseDeleteModal}>
            <DeleteModalContent onClick={(e) => e.stopPropagation()}>
              <DeleteTitle>⚠️ Excluir Preset</DeleteTitle>
              <DeleteText>
                {`Tem certeza que deseja excluir o perfil "${selectedPreset.namePreset}"?`}
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

        <NavButton direction="right" onClick={() => scroll("right")}>
          <ArrowIcon direction="right" />
        </NavButton>
      </CarouselArea>
    </BlockContainer>
  );
}

PresetBlock.propTypes = {
  searchTerm: PropTypes.string.isRequired,
};
