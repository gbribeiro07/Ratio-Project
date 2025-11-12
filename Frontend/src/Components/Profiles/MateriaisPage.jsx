import styled from "styled-components";
import { useState, useMemo } from "react";

const breakpoints = {
  tablet: "768px",
  mobileL: "425px",
};

const MATERIAIS_APOIO = [
  {
    title: "Sobre as Artes Liberais",
    url: "https://artesliberais.com.br/artesliberais/",
  },
  {
    title: "Exercícios de Aritmética",
    url: "https://portaldaobmep.impa.br/uploads/msg/crmktm3d6kg0w.pdf",
  },
  {
    title: "Exercícios de Geometria",
    url: "https://www.todamateria.com.br/area-de-figuras-planas-exercicios/",
  },
  {
    title: "Sobre a Geometria Euclidiana",
    url: "https://professor.ufop.br/sites/default/files/santostf/files/geometria_euclidiana_plana.pdf",
  },
  {
    title: "Sobre a Educação Clássica",
    url: "https://rafaelfalcon.com.br/artigos/o-que-e-educacao-classica/",
  },
];

const MateriaisPageContainer = styled.div`
  background-color: #101010;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  font-family: "Georgia", serif;
  color: white;
  padding: 40px;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 20px;
  }
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

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.8rem;
    margin-bottom: 30px;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  max-width: 700px;
  width: 100%;

  @media (max-width: ${breakpoints.mobileL}) {
    margin-bottom: 25px;
  }
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

  @media (max-width: ${breakpoints.mobileL}) {
    padding: 10px 15px;
  }
`;

const CarouselWrapperVertical = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll; /* Carrossel Vertical */
  scroll-behavior: smooth;
  padding: 10px 0;
  gap: 20px;
  flex-grow: 1;
  max-width: 900px;
  width: 100%;
  height: 65vh;
  box-sizing: border-box;

  /* Estilos para a barra de rolagem (WebKit) */
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

  /* Estilos para a barra de rolagem (Firefox) */
  scrollbar-width: thin;
  scrollbar-color: blueviolet #1a1a1a;
`;

const ArticleCard = styled.a.attrs({
  target: "_blank",
  rel: "noopener noreferrer",
})`
  flex-shrink: 0;
  width: 100%;
  border-radius: 12px;
  background-color: #2c2724;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-left: 5px solid blueviolet;
  text-decoration: none;
  color: #f0f0f0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(138, 43, 226, 0.5);
  }

  @media (max-width: ${breakpoints.tablet}) {
    padding: 15px;
  }
`;

const CardTitle = styled.h4`
  font-size: 1.4rem;
  margin: 0 0 5px 0;
  color: #f0f0f0;
  white-space: normal;
  overflow: hidden;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.2rem;
  }
`;

const CardUrl = styled.p`
  font-size: 0.85rem;
  color: #cccccc;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default function TeoriaPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Lógica de filtragem dos artigos baseada no termo de pesquisa
  const filteredArtigos = useMemo(() => {
    if (!searchTerm) return MATERIAIS_APOIO;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return MATERIAIS_APOIO.filter((artigo) =>
      artigo.title.toLowerCase().includes(lowerCaseSearch)
    );
  }, [searchTerm]);

  return (
    <MateriaisPageContainer>
      <Title>
        Materiais de <span>Apoio</span>
      </Title>

      <ControlsContainer>
        <SearchInput
          type="text"
          placeholder="Pesquisar assuntos (Ex: Aritmética, Geometria)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </ControlsContainer>

      <CarouselWrapperVertical>
        {filteredArtigos.length > 0 ? (
          filteredArtigos.map((artigo, index) => (
            <ArticleCard key={index} href={artigo.url}>
              <div>
                <CardTitle>{artigo.title}</CardTitle>
                <CardUrl>Fonte: {artigo.url}</CardUrl>
              </div>
            </ArticleCard>
          ))
        ) : (
          <p
            style={{
              color: "#aaa",
              textAlign: "center",
              marginTop: "30px",
              width: "100%",
            }}
          >
            Nenhum artigo encontrado para {searchTerm}.
          </p>
        )}
      </CarouselWrapperVertical>
    </MateriaisPageContainer>
  );
}
