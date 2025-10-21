import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import { useState } from "react";
import { registerProfile } from "../../Services/Profile.Api";

// Keyframes (Reutilizado do SignUpForm)
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideDown = keyframes`
  from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// --- Styled Components ---

// Modal Fundo (Com escurecimento)
const ModalFundo = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85); /* Mais escuro para destaque */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

// Modal Conteúdo (Inspirado no FormContainer)
const ModalConteudo = styled.form`
  background: linear-gradient(145deg, #2c2724, #1f1b18);
  padding: 40px;
  border-radius: 12px;
  width: 450px;
  max-width: 90%;
  text-align: center;
  color: #f0f0f0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  animation: ${slideDown} 0.5s ease-out;
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 24px;
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
    border-color: #6c00ff; /* Cor roxa do Ratio */
    outline: none;
    box-shadow: 0 0 5px rgba(108, 0, 255, 0.5);
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
  background-color: #6c00ff; /* Cor roxa */
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

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: #ccc;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #f0f0f0;
  }
`;

const Message = styled.p`
  color: ${(props) => (props.error ? "red" : "#6C00FF")};
  margin-top: 15px;
  font-size: 14px;
`;

// --- Componente Modal ---

export default function ProfilesForm({ onClose, onProfileCreated }) {
  const [nameProfile, setNameProfile] = useState("");
  const [age, setAge] = useState("");
  const [avatar, setAvatar] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!nameProfile.trim()) {
      setMessage({ text: "O nome do perfil é obrigatório!", error: true });
      return;
    }

    setIsLoading(true);

    // Converte a idade para número (ou null se vazia)
    const profileAge = age ? parseInt(age, 10) : null;

    try {
      const response = await registerProfile(nameProfile, profileAge, avatar);

      if (response.success) {
        setMessage({ text: "Perfil criado com sucesso!", error: false });
        onProfileCreated(); // Notifica o ProfilesBlock para recarregar a lista
        setTimeout(onClose, 1000); // Fecha o modal após 1 segundo
      } else {
        setMessage({
          text: response.message || "Erro ao criar perfil.",
          error: true,
        });
      }
    } catch (error) {
      console.error("Erro ao registrar perfil:", error);
      setMessage({
        text: error.message || "Não foi possível conectar ao servidor.",
        error: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalFundo onClick={onClose}>
      {/* O onClick={e => e.stopPropagation()} impede que o clique no modal feche ele */}
      <ModalConteudo
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose} type="button">
          ×
        </CloseButton>

        <Title>Criar Novo Perfil</Title>

        <Label htmlFor="name">Nome do Perfil *</Label>
        <Input
          id="name"
          type="text"
          placeholder="Ex: Ana, Criança 1"
          value={nameProfile}
          onChange={(e) => setNameProfile(e.target.value)}
        />

        <Label htmlFor="age">Idade (Opcional)</Label>
        <Input
          id="age"
          type="number"
          placeholder="Ex: 8"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          min="1"
          max="120"
        />

        <Label htmlFor="avatar">Link ou Base64 do Avatar (Opcional)</Label>
        <Input
          id="avatar"
          type="text"
          placeholder="URL da imagem ou código Base64"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />

        {message && <Message error={message.error}>{message.text}</Message>}

        <SubmitButton type="submit" disabled={isLoading || !nameProfile.trim()}>
          {isLoading ? "Criando..." : "Cadastrar Perfil"}
        </SubmitButton>
      </ModalConteudo>
    </ModalFundo>
  );
}

ProfilesForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onProfileCreated: PropTypes.func.isRequired,
};
