import styled from "styled-components";
import { useState, useMemo } from "react";

const breakpoints = {
  tablet: "768px",
  mobileL: "425px",
};

const TUTORIAIS = [
  {
    title: "Como fazer Cadastro e Login",
    url: "https://www.youtube.com/watch?v=tutorial_cadastro",
  },
  {
    title: "Como criar um perfil",
    url: "https://www.youtube.com/watch?v=tutorial_perfil_criar",
  },
  {
    title: "Como editar um perfil",
    url: "https://www.youtube.com/watch?v=tutorial_perfil_editar",
  },
  {
    title: "Como criar um jogo",
    url: "https://www.youtube.com/watch?v=tutorial_jogo_criar",
  },
  {
    title: "Como jogar um jogo",
    url: "https://www.youtube.com/watch?v=tutorial_jogo_jogar",
  },
];

const TutoriaisPageContainer = styled.div`
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
  overflow-y: scroll;
  scroll-behavior: smooth;
  padding: 10px 0;
  gap: 20px;
  flex-grow: 1;
  max-width: 900px;
  width: 100%;
  height: 65vh;
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
`;

const TutorialCard = styled.a.attrs({
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

export default function TutoriaisPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTutoriais = useMemo(() => {
    if (!searchTerm) return TUTORIAIS;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return TUTORIAIS.filter((tutorial) =>
      tutorial.title.toLowerCase().includes(lowerCaseSearch)
    );
  }, [searchTerm]);

  return (
    <TutoriaisPageContainer>
      <Title>
        Lista de <span>Tutoriais</span>
      </Title>

      <ControlsContainer>
        <SearchInput
          type="text"
          placeholder="Pesquisar tutoriais (Ex: Login, Criar Jogo)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </ControlsContainer>

      <CarouselWrapperVertical>
        {filteredTutoriais.length > 0 ? (
          filteredTutoriais.map((tutorial, index) => (
            <TutorialCard key={index} href={tutorial.url}>
              <div>
                <CardTitle>{tutorial.title}</CardTitle>
                <CardUrl>YouTube: {tutorial.url}</CardUrl>
              </div>
            </TutorialCard>
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
            Nenhum tutorial encontrado para {searchTerm}.
          </p>
        )}
      </CarouselWrapperVertical>
    </TutoriaisPageContainer>
  );
}
