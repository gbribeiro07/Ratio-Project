import styled from "styled-components";

const breakpoints = {
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "425px",
  tablet: "768px",
  laptop: "1024px",
  laptopL: "1440px",
  desktop: "2560px",
};

const StyledPB3 = styled.div`
  background-color: #1a022f;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 3em;
  text-align: center;
  margin-bottom: 10px;
  font-weight: bold;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  @media (max-width: ${breakpoints.laptop}) {
    font-size: 2.5em;
  }
  @media (max-width: ${breakpoints.tablet}) {
    font-size: 2em;
  }
  @media (max-width: ${breakpoints.mobileL}) {
    font-size: 1.8em;
  }
  @media (max-width: ${breakpoints.mobileM}) {
    font-size: 1.5em;
  }
`;

const Line = styled.div`
  width: 400px;
  height: 3px;
  background-color: white;
  margin-bottom: 50px;

  @media (max-width: ${breakpoints.laptop}) {
    width: 200px;
  }
  @media (max-width: ${breakpoints.tablet}) {
    width: 180px;
    margin-bottom: 40px;
  }
  @media (max-width: ${breakpoints.mobileL}) {
    width: 150px;
    margin-bottom: 30px;
  }
`;

const Button = styled.button`
  background-color: blueviolet;
  color: white;
  font-size: 1.5em;
  padding: 20px 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.3s ease;
  max-width: 90%;

  &:hover {
    background-color: #7b29e0;
    transform: translateY(-3px);
  }

  @media (max-width: ${breakpoints.laptop}) {
    font-size: 1.3em;
    padding: 18px 35px;
  }
  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.1em;
    padding: 15px 30px;
  }
  @media (max-width: ${breakpoints.mobileL}) {
    font-size: 1em;
    padding: 12px 25px;
  }
  @media (max-width: ${breakpoints.mobileM}) {
    font-size: 0.9em;
    padding: 10px 20px;
  }
`;

function PB3() {
  const redirectToSignUp = () => {
    window.location.href = "/SignUp";
  };

  return (
    <StyledPB3>
      <Title>Junte-se a nós!</Title>
      <Line />
      <Button onClick={redirectToSignUp}>
        Transforme a educação das suas crianças!
      </Button>
    </StyledPB3>
  );
}

export default PB3;
