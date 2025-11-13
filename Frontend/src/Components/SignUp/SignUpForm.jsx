import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../../Services/User.Api";
import { verifyEmailUser } from "../../Services/User.Api";

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

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FormContainer = styled.form`
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

// Container para a mensagem de sucesso (novo componente)
const SuccessMessageContainer = styled.div`
  background-color: #2c2724;
  padding: 40px;
  border-radius: 12px;
  width: 450px;
  min-height: 50vh;
  max-width: 90%;
  justify-content: center;
  text-align: center;
  color: #f0f0f0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  margin: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  animation: ${slideUp} 0.8s ease-out;
`;

const SuccessTitle = styled.h2`
  color: #a84cff;
  font-size: 24px;
  margin-bottom: 35px;
`;

const SuccessText = styled.p`
  font-size: 16px;
  margin-bottom: 25px;
`;

const LoginLink = styled(Link)`
  font-weight: bold;
  color: #a84cff;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #5a00ae;
  }
`;

// Estilização do modal (mantida, mas com leves ajustes)
const ModalFundo = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75); /* Fundo mais escuro */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalConteúdo = styled.div`
  background: #1e1a17;
  width: 400px; /* Tamanho fixo para o modal de código */
  max-width: 85%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 30px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
`;

const TítuloModal = styled.h2`
  font-weight: bold;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
  color: #f0f0f0;
  margin-bottom: 20px;
  font-size: 20px;
`;

// Estilização do Input de código no modal (Reutiliza Input, mas com estilo específico)
const CodeInput = styled(Input)`
  text-align: center;
  font-size: 20px;
  letter-spacing: 5px; /* Espaçamento para o código */
`;

const CodeSubButton = styled(SubmitButton)`
  width: 100%;
  margin-top: 30px;
  padding: 10px;
`;

/* --- Componente SignUpForm.jsx --- */

export default function SignUpForm() {
  // estados para armazenar os valores dos Inputs
  const [modalAberto, setModalAberto] = useState(false);
  const [nameUser, setNameUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // NOVO estado para controlar a exibição da mensagem de sucesso
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!nameUser || !email || !password) {
      setMessage("Preencha todos os campos!");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Por favor, insira um e-mail válido!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser(nameUser, email, password);

      if (!response.success) {
        setMessage(response.message || "Erro no pré-cadastro");
        return;
      }

      setMessage("Código de verificação enviado para seu e-mail!");
      setModalAberto(true);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      setMessage(error.message || "Erro ao processar cadastro");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setMessage("Digite o código de verificação!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await verifyEmailUser(email, verificationCode);

      if (!response.success) {
        setMessage(response.message || "Código inválido!");
        return;
      }

      // NOVO: Define isRegistered como true após sucesso
      setIsRegistered(true);
      setMessage("Cadastro concluído com sucesso!");
      setModalAberto(false);

      // Limpa os dados do formulário
      setNameUser("");
      setEmail("");
      setPassword("");
      setVerificationCode("");
    } catch (error) {
      console.error("Erro ao verificar código:", error);
      setMessage(error.message || "Erro ao verificar código");
    } finally {
      setIsLoading(false);
    }
  };

  /* --- Modificação no return para exibir a mensagem de sucesso --- */
  return (
    <>
      {/* 1. Exibir Mensagem de Sucesso e Link para Login */}
      {isRegistered ? (
        <SuccessMessageContainer>
          <SuccessTitle> Cadastro Concluído! </SuccessTitle>
          <SuccessText>Seu cadastro foi realizado com sucesso.</SuccessText>
          <p>
            Você já pode acessar sua conta!
            <br />
            <LoginLink to="/Login">Clique aqui para fazer Login</LoginLink>
          </p>
        </SuccessMessageContainer>
      ) : (
        /* 2. Exibir Formulário de Cadastro (se não estiver registrado) */
        <FormContainer onSubmit={handleSubmit}>
          <Title>CADASTRO</Title>
          <Label htmlFor="name">Nome:</Label>
          <Input
            id="name"
            type="text"
            placeholder="Digite seu nome"
            value={nameUser}
            onChange={(e) => setNameUser(e.target.value)}
          />

          <Label htmlFor="email">E-mail:</Label>
          <Input
            id="email"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Label htmlFor="password">Senha:</Label>
          <Input
            id="password"
            type="password"
            placeholder="Crie uma senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "Processando..." : "Cadastrar-se"}
          </SubmitButton>
          <BackLink to="/Presentation">Voltar</BackLink>
        </FormContainer>
      )}

      {/* 3. Exibir Modal de Verificação de Código */}
      {modalAberto && (
        <ModalFundo>
          <ModalConteúdo>
            <TítuloModal>🔑 Digite o código de verificação</TítuloModal>
            <CodeInput
              type="text"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <CodeSubButton onClick={handleVerifyCode} disabled={isLoading}>
              {isLoading ? "Verificando..." : "Confirmar Código"}
            </CodeSubButton>
          </ModalConteúdo>
        </ModalFundo>
      )}

      {/* 4. Exibir Mensagem de Erro/Informação */}
      {message &&
        !isRegistered && ( // Não exibe mensagem padrão se o cadastro foi concluído
          <p style={{ color: "white", textAlign: "center", marginTop: "20px" }}>
            {message}
          </p>
        )}
    </>
  );
}
