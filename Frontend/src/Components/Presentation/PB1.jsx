import styled from "styled-components";
import AristotelesImg from "../../assets/Aristoteles-semfundo.png";

const PB1 = () => {
  return (
    <Container>
      <LeftSide>
        <LineContainer>
          <WhiteDot />
        </LineContainer>
        <TextContainer>
          <Title>Educação</Title>
          <Subtitle>
            A Ratio é uma plataforma digital a qual tem por missão servir como
            um ambiente digital para que, por meio de jogos interativos, pais e
            mestres possam educar seus filhos e alunos, do Ensino Fundamental I,
            em Lógica e Matemática.
          </Subtitle>
        </TextContainer>
      </LeftSide>

      <RightSide>
        <Image src={AristotelesImg} alt="Aristóteles" />
      </RightSide>
    </Container>
  );
};

export default PB1;

const Container = styled.div`
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  width: 100%;
  padding: 0 5%;
  position: relative;
  overflow: hidden;
  z-index: 1;

  @media (max-width: 1200px) {
    flex-direction: column;
    text-align: center;
    gap: 40px;
    padding: 60px 5%;
  }

  @media (max-width: 768px) {
    padding: 40px 3%;
  }

  @media (max-width: 480px) {
    padding: 30px 5%;
    min-height: auto;
  }
`;

const LeftSide = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  max-width: 50%;
  position: relative;

  @media (max-width: 1200px) {
    max-width: 80%;
    align-items: center;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const LineContainer = styled.div`
  position: relative;
  width: 4px;
  height: 600px;
  border-radius: 2px;
  background: linear-gradient(
    rgba(255, 255, 255, 0),
    white 20%,
    white 80%,
    rgba(255, 255, 255, 0)
  );

  @media (max-width: 768px) {
    height: 300px;
  }

  @media (max-width: 480px) {
    height: 200px;
  }
`;

const WhiteDot = styled.div`
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
`;

const TextContainer = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  color: blueviolet;
  margin: 0 0 1rem 0;
  margin-left: 10px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  @media (max-width: 1200px) {
    font-size: 3rem;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-left: 0;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 500;
  max-width: 600px;
  margin-left: 10px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  @media (max-width: 1200px) {
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    max-width: 90%;
    margin-left: 0;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const RightSide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-shrink: 0;
  z-index: 0;
  overflow: hidden;

  @media (max-width: 1200px) {
    width: 100%;
  }

  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

const Image = styled.img`
  width: 600px;
  max-width: 100%;
  height: auto;
  filter: brightness(0.9);
  z-index: 0;
  position: relative;
  object-fit: contain;

  @media (max-width: 1200px) {
    width: 450px;
  }

  @media (max-width: 768px) {
    width: 320px;
  }

  @media (max-width: 480px) {
    width: 250px;
  }
`;
