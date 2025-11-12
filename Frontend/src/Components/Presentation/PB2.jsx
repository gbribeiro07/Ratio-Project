import styled from "styled-components";
import EuclidesImage from "../../assets/Euclides-semfundo.png";

const PB2 = () => {
  return (
    <Container>
      <LeftSide>
        <LineContainer>
          {/* <BlackLine /> */}
          <BlackDot />
        </LineContainer>

        <TextContainer>
          <Title>Jogos</Title>
          <Subtitle>
            A dinâmica dos jogos é simples e eficaz: o usuário, o qual pode ser
            pai e/ou professor, terá a oportunidade de criar jogos para seus
            filhos e/ou alunos, escrevendo as perguntas, as respostas que devem
            ser dadas, quantas fases o jogo terá, sobre qual tópico ele será,
            para quais perfis de quais alunos o jogo será enviado, etc. Assim,
            garantimos uma experiência mais personalizada e enriquecedora!
          </Subtitle>
        </TextContainer>
      </LeftSide>

      <RightSide>
        <Image src={EuclidesImage} alt="Euclides" />
      </RightSide>
    </Container>
  );
};

export default PB2;

const Container = styled.div`
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  width: 100%;
  padding: 0;
  position: relative;
  z-index: 1;

  @media (max-width: 1200px) {
    flex-direction: column;
    text-align: center;
    gap: 40px;
  }

  @media (max-width: 768px) {
    padding: 0 3%;
  }

  @media (max-width: 480px) {
    min-height: auto;
    padding: 30px 5%;
  }
`;

const LeftSide = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  max-width: 50%;
  padding-left: 5%;

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
  margin-top: 10px;
  background: linear-gradient(
    rgba(0, 0, 0, 0),
    black 20%,
    black 80%,
    rgba(0, 0, 0, 0)
  );

  @media (max-width: 768px) {
    height: 400px;
  }

  @media (max-width: 480px) {
    height: 250px;
  }
`;

const BlackDot = styled.div`
  position: absolute;
  top: 50px;
  left: -8px;
  width: 20px;
  height: 20px;
  background-color: black;
  border-radius: 50%;
`;

const TextContainer = styled.div`
  color: black;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  color: red;
  margin: 0 0 1rem 0;
  margin-left: 10px;
  margin-top: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  position: relative;

  &::after {
    content: "";
    display: block;
    width: 190px;
    height: 4px;
    background-color: red;
    margin-top: 8px;
    border-radius: 2px;
  }

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
  font-weight: 600;
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
  justify-content: flex-end;
  align-items: center;
  position: relative;
  z-index: 0;
  flex: 1;

  @media (max-width: 1200px) {
    justify-content: center;
  }

  @media (max-width: 768px) {
    margin-top: 30px;
  }
`;

const Image = styled.img`
  width: 600px;
  max-width: 100%;
  height: auto;
  filter: brightness(0.9);
  z-index: 0;

  @media (max-width: 1200px) {
    width: 500px;
  }

  @media (max-width: 768px) {
    width: 350px;
  }

  @media (max-width: 480px) {
    width: 280px;
  }
`;
