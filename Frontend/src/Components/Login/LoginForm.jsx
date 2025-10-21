import styled, { keyframes } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../../Services/Auth.Api";

// Keyframes para animação de entrada
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FormContainer = styled.div`
  background: linear-gradient(145deg, #2c2724, #1f1b18);
  padding: 40px;
  border-radius: 12px;
  width: 650px;
  max-width: 90%;
  text-align: center;
  color: #f0f0f0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  margin: auto;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 0.6s ease-out;
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 28px;
  margin-bottom: 30px;
  color: #f0f0f0;
  text-transform: uppercase;
`;

const Label = styled.label`
  display: block;
  margin: 15px 0 8px;
  font-weight: 600;
  text-align: left;
  font-size: 14px;
  color: #cccccc;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #4a4440;
  border-radius: 8px;
  background-color: #1e1a17;
  color: #ffffff;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    border-color: blueviolet;
    outline: none;
    box-shadow: 0 0 5px rgba(88, 0, 170, 0.5);
  }

  &::placeholder {
    color: #888;
  }
`;

const SubmitButton = styled.button`
  margin-top: 30px;
  display: block;
  width: 100%;
  padding: 12px;
  background-color: blueviolet;
  color: #1e1a17;
  font-weight: bold;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #5a00ae;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #4a4440;
    cursor: not-allowed;
    transform: none;
  }
`;

const BackLink = styled(Link)`
  display: block;
  margin-top: 25px;
  font-size: 14px;
  color: #ccc;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;

  &:before {
    content: "← ";
  }

  &:hover {
    color: blueviolet;
  }
`;

const RegisterLink = styled.p`
  margin-top: 70px;
  font-size: 14px;
  font-weight: bold;
`;

const StyledLink = styled(Link)`
  color: blueviolet;
  font-weight: bold;
  text-decoration: none;
  &:hover {
    color: #5a00ae;
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
      setMessage("Erro ao fazer login. Tente novamente.");
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
