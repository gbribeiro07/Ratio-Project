import styled from "styled-components";
import { useState, useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { getPresets } from "../../Services/Games/GameContent.Api";

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

export default function PresetBlock({ searchTerm }) {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
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
            </PresetCard>
          ))}
        </CarouselWrapper>

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
