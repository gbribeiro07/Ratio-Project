import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import { useState } from "react";
import { registerProfile, updateProfile } from "../../../Services/Profile.Api";

// Keyframes (Reutilizado do SignUpForm)
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideDown = keyframes`
  from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

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
  position: relative;
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
  background-color: blueviolet;
  color: #1e1a17;
  font-weight: bold;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #48008b;
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
  top: 15px;
  right: 15px;
  margin-bottom: 30px;
  background: transparent;
  border: none;
  color: #ccc;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #ff0000;
  }
`;

const RemoveImageButton = styled.button`
  background: #ff4444;
  border: none;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #cc0000;
  }
`;

const Message = styled.p`
  color: ${(props) => (props.$error ? "red" : "#6C00FF")};
  margin-top: 15px;
  font-size: 14px;
`;

// --- Componente Modal ---

export default function ProfilesForm({
  onClose,
  onProfileCreated,
  profileToEdit,
}) {
  const [nameProfile, setNameProfile] = useState(
    profileToEdit?.nameProfile || ""
  );
  const [age, setAge] = useState(profileToEdit?.age || "");
  const [avatar, setAvatar] = useState(profileToEdit?.avatar || "");
  const [avatarPreview, setAvatarPreview] = useState(
    profileToEdit?.avatar || ""
  );
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const modalTitle = profileToEdit ? "Editar Perfil" : "Criar Novo Perfil";

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
      let response;

      if (profileToEdit) {
        // Modo edição
        response = await updateProfile(profileToEdit.idProfile, {
          nameProfile,
          age: profileAge,
          avatar,
        });
      } else {
        // Modo criação
        response = await registerProfile(nameProfile, profileAge, avatar);
      }

      if (response.success) {
        setMessage({
          text: profileToEdit
            ? "Perfil atualizado com sucesso!"
            : "Perfil criado com sucesso!",
          error: false,
        });
        onProfileCreated();
        setTimeout(onClose, 1000);
      } else {
        setMessage({
          text:
            response.message ||
            `Erro ao ${profileToEdit ? "atualizar" : "criar"} perfil.`,
          error: true,
        });
      }
    } catch (error) {
      console.error(
        `Erro ao ${profileToEdit ? "atualizar" : "registrar"} perfil:`,
        error
      );
      setMessage({
        text: error.message || "Não foi possível conectar ao servidor.",
        error: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const compressImage = (
    file,
    maxWidth = 200,
    maxHeight = 200,
    quality = 0.8
  ) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Redimensionar mantendo a proporção
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Converter para base64 com qualidade reduzida
          canvas.toBlob(
            (blob) => {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onload = () => resolve(reader.result);
              reader.onerror = (error) => reject(error);
            },
            "image/jpeg",
            quality
          );
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      setAvatar("");
      setAvatarPreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage({ text: "Por favor, selecione apenas imagens!", error: true });
      return;
    }

    // Validação do tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ text: "A imagem deve ter no máximo 5MB!", error: true });
      return;
    }

    setIsLoading(true); // Mostrar loading durante a compressão

    try {
      // Comprimir a imagem
      const compressedBase64 = await compressImage(file);

      // Criar prévia (usando a base64 comprimida)
      setAvatarPreview(compressedBase64);
      setAvatar(compressedBase64); // Salva o Base64 comprimido no estado
      setMessage(""); // Limpa mensagens de erro
    } catch (error) {
      console.error("Erro ao comprimir imagem:", error);
      setMessage({ text: "Erro ao processar a imagem.", error: true });
    } finally {
      setIsLoading(false);
    }
  };

  const clearAvatar = () => {
    setAvatar("");
    setAvatarPreview("");
    // Limpa o input file
    const fileInput = document.getElementById("avatar");
    if (fileInput) fileInput.value = "";
  };

  return (
    <ModalFundo onClick={onClose}>
      {/* O onClick={e => e.stopPropagation()} impede que o clique no modal feche ele */}
      <ModalConteudo
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose} type="button">
          X
        </CloseButton>

        <Title>{modalTitle}</Title>

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

        <Label htmlFor="avatar">Avatar (Opcional)</Label>

        <Input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          style={{ display: "none" }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            marginBottom: "15px",
            position: "relative",
          }}
        >
          <button
            type="button"
            onClick={() => document.getElementById("avatar").click()}
            style={{
              padding: "10px 20px",
              backgroundColor: "transparent",
              border: "2px dashed #6c00ff",
              borderRadius: "8px",
              color: "#6c00ff",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.3s",
            }}
          >
            📷 Escolher Imagem
          </button>

          {avatarPreview && (
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #6c00ff",
                marginTop: "10px",
                position: "relative",
              }}
            >
              <img
                src={avatarPreview}
                alt="Prévia do avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <RemoveImageButton onClick={clearAvatar}>X</RemoveImageButton>
            </div>
          )}
        </div>

        {message && <Message error={message.$error}>{message.text}</Message>}

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
  profileToEdit: PropTypes.shape({
    idProfile: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    nameProfile: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    avatar: PropTypes.string,
  }),
};
