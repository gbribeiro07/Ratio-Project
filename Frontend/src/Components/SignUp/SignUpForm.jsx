import styled from "styled-components";
import { Link } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../../Services/User.Api";
import { verifyEmailUser } from "../../Services/User.Api";

const FormContainer = styled.form`
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

const ModalFundo = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Fundo escurecido */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalConteúdo = styled.div`
  background-color: #dcdcdc;
  width: 75vw;
  height: 85vh;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 40px 70px;
  position: relative;

  @media (max-width: 1800px) {
    width: 70vw;
    height: 82vh;
  }
`;

const TítuloModal = styled.h2`
  font-weight: bold;
  font-family: Arial, sans-serif;
  text-align: center;
  vertical-align: top;
  margin-bottom: 30px;

  @media (max-width: 1225px) {
    font-size: 22px;
  }

  @media (max-width: 980px) {
    font-size: 20px;
  }

  @media (max-width: 810px) {
    font-size: 18px;
  }

  @media (max-width: 740px) {
    font-size: 17px;
  }

  @media (max-width: 490px) {
    font-size: 12px;
  }
`;

const CodeSubButton = styled.button`
  margin-top: 20px;
  display: block;
  width: 250px;
  height: 40px;
  margin-top: 5vh;
  margin-left: 25vw;
  padding: 10px;
  background-color: #00cc66;
  color: white;
  font-weight: bold;
  font-family: Arial, sans-serif;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background-color: #00994d;
  }

  @media (max-width: 1800px) {
    margin-top: 2vh;
    margin-left: 23vw;
  }

  @media (max-width: 1225px) {
    margin-left: 15vw;
    width: 230px;
    height: 38px;
    font-size: 15px;
  }

  @media (max-width: 980px) {
    margin-left: 10vw;
    width: 220px;
    height: 36px;
    font-size: 14px;
  }

  @media (max-width: 810px) {
    margin-left: 7vw;
    width: 210px;
    height: 35px;
    font-size: 13.5px;
  }

  @media (max-width: 740px) {
    margin-left: 4vw;
    width: 200px;
    height: 34px;
    font-size: 13px;
  }

  @media (max-width: 490px) {
    margin-left: 2vw;
    width: 160px;
    height: 25px;
    font-size: 9px;
  }
`;

export default function SignUpForm() {
  //estados para armazenar os valores dos Inputs
  const [modalAberto, setModalAberto] = useState(false);
  const [nameUser, setNameUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

      setMessage("Cadastro concluído com sucesso! Você já pode fazer login.");
      setTimeout(() => {
        setMessage("");
        setModalAberto(false);
        setNameUser("");
        setEmail("");
        setPassword("");
        setVerificationCode("");
      }, 3000);
    } catch (error) {
      console.error("Erro ao verificar código:", error);
      setMessage(error.message || "Erro ao verificar código");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FormContainer onSubmit={handleSubmit}>
        <Title>CADASTRO</Title>
        <Label>Nome:</Label>
        <Input
          type="text"
          placeholder="Digite seu nome"
          value={nameUser}
          onChange={(e) => setNameUser(e.target.value)}
        />

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
          placeholder="Crie uma senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? "Processando..." : "Cadastrar-se"}
        </SubmitButton>
        <BackLink to="/Presentation">Voltar</BackLink>
      </FormContainer>

      {modalAberto && (
        <ModalFundo>
          <ModalConteúdo>
            <TítuloModal>Digite o código de verificação</TítuloModal>
            <Input
              type="text"
              placeholder="Código enviado ao seu e-mail"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <CodeSubButton onClick={handleVerifyCode} disabled={isLoading}>
              {isLoading ? "Verificando..." : "Confirmar Código"}
            </CodeSubButton>
          </ModalConteúdo>
        </ModalFundo>
      )}
      {message && (
        <p style={{ color: "white", textAlign: "center", marginTop: "20px" }}>
          {message}
        </p>
      )}
    </>
  );
}
