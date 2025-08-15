import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../../Services/Auth.Api";

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
  padding: 10px;
  background-color: #00cc66;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #00994d;
  }
`;

const RegisterLink = styled.p`
  margin-top: 70px;
  font-size: 14px;
  font-weight: bold;
`;

const StyledLink = styled(Link)`
  color: blue;
  font-weight: bold;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const BackLink = styled(Link)`
  display: block;
  margin-top: 20px;
  font-size: 14px;
  font-weight: bold;
  color: black;
  &:before {
    content: "← ";
  }
  &:hover {
    text-decoration: underline;
    color: blueviolet;
  }
`;

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Preencha todos os campos!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser(email, password);

      if (!response.success) {
        setMessage(response.message || "Credenciais inválidas");
        return;
      }

      // Garante que cookies/tokens estejam setados antes de prosseguir
      await new Promise((resolve) => setTimeout(resolve, 200));

      navigate("/Home", { replace: true, state: { fromLogin: true } });
    } catch (error) {
      console.error("Erro no login:", error);
      setMessage("Erro ao conectar com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <Title>LOGIN</Title>
      <form onSubmit={handleLogin}>
        <Label>E-mail:</Label>
        <Input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Label>Senha:</Label>
        <Input
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </SubmitButton>
      </form>

      {message && <p>{message}</p>}

      <RegisterLink>
        Não tem conta ainda? <StyledLink to="/SignUp">Cadastre-se!</StyledLink>
      </RegisterLink>
      <BackLink to="/Presentation">Voltar</BackLink>
    </FormContainer>
  );
}
