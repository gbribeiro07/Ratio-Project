import styled from "styled-components";
import { Link } from "react-router-dom";

const FormContainer = styled.div`
  background-color: #3a322d;
  padding: 70px;
  border-radius: 10px;
  width: 600px;
  text-align: center;
  color: white;
  font-family: Arial, sans-serif;
  margin: auto;
  margin-top: 100px;
`;

const Title = styled.h2`
  font-weight: bold;
`;

const Label = styled.label`
  display: block;
  margin: 15px 0 5px;
  font-weight: bold;
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #d3d3d3;
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  display: block;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 0;
  padding: 10px;
  background-color: #00cc66;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background-color: #00994d;
  }
`;

const BackLink = styled(Link)`
  display: block;
  margin-top: 20px;
  margin-bottom: -10px;
  font-size: 14px;
  color: black;
  text-decoration: none;
  font-weight: bold;

  &:before {
    content: "← ";
  }

  &:hover {
    text-decoration: underline;
    color: blueviolet;
  }
`;

export default function SignUpForm() {
  return (
    <FormContainer>
      <Title>CADASTRO</Title>
      <form>
        <Label>Nome (completo):</Label>
        <Input type="text" placeholder="Digite seu nome" />

        <Label>E-mail:</Label>
        <Input type="email" placeholder="Digite seu e-mail" />

        <Label>Senha:</Label>
        <Input type="password" placeholder="Digite sua senha" />

        <SubmitButton>Cadastrar-se</SubmitButton>
      </form>
      <BackLink to="/Presentation">Voltar</BackLink>
    </FormContainer>
  );
}
