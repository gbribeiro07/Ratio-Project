import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  updateUser,
  deleteUser,
  logoutUser,
  getUser,
} from "../../Services/User.Api.js";
import profileIcon from "../../Assets/profile-icon.png";

const UserIconContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const UserModal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 300px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const EditModal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  width: 400px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const ConfirmModal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 350px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const UserInfo = styled.div`
  text-align: center;
  margin-bottom: 24px;

  h3 {
    margin: 0 0 8px 0;
    color: #333;
    font-size: 18px;
  }

  p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background-color 0.3s;
  font-size: 14px;
  color: #333;

  &:hover {
    background-color: #f5f5f5;
  }

  &.danger {
    color: #e74c3c;

    &:hover {
      background-color: #ffeaea;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 4px;

  &:hover {
    color: #ff0000;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: blueviolet;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;

  &.primary {
    background-color: blueviolet;
    color: white;

    &:hover {
      background-color: blueviolet;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }

  &.secondary {
    background-color: #6c757d;
    color: white;

    &:hover {
      background-color: #545b62;
    }
  }

  &.danger {
    background-color: #e74c3c;
    color: white;

    &:hover {
      background-color: #c0392b;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 14px;
  margin: 0;
  text-align: center;
`;

const SuccessMessage = styled.p`
  color: #27ae60;
  font-size: 14px;
  margin: 0;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

export default function UserIcon() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const modalRef = useRef(null);

  const [editForm, setEditForm] = useState({
    nameUser: "",
    email: "",
    password: "",
  });

  // Fechar modal ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    }

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  // Buscar dados do usuário quando o modal abre
  useEffect(() => {
    if (showModal && !userData) {
      fetchUserData();
    }
  }, [showModal, userData]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await getUser();
      if (response.success) {
        setUserData(response.data);
        setEditForm({
          nameUser: response.data.nameUser,
          email: response.data.email,
          password: "",
        });
      }
    } catch (error) {
      // ← Mudei 'err' para 'error' e vou usar a variável
      setError(`Erro ao carregar dados do usuário: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const response = await updateUser(editForm);

      if (response.success) {
        setSuccess("Dados de usuário atualizados com sucesso!");
        setUserData(response.data);
        setTimeout(() => {
          setShowEditModal(false);
          setSuccess("");
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const response = await deleteUser();

      if (response.success) {
        setShowConfirmModal(false);
        setShowModal(false);
        navigate("/SignUp");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await logoutUser();

      if (response.success) {
        setShowModal(false);
        navigate("/Login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <UserIconContainer>
      <IconButton onClick={() => setShowModal(true)}>
        <img src={profileIcon} alt="Perfil do usuário" />
      </IconButton>

      {showModal && (
        <ModalOverlay>
          <UserModal ref={modalRef}>
            <CloseButton onClick={() => setShowModal(false)}>x</CloseButton>

            {loading && !userData ? (
              <LoadingSpinner>Carregando...</LoadingSpinner>
            ) : userData ? (
              <>
                <UserInfo>
                  <h3>{userData.nameUser}</h3>
                  <p>{userData.email}</p>
                </UserInfo>

                <MenuItem onClick={() => setShowEditModal(true)}>
                  ✏️ Editar dados
                </MenuItem>

                <MenuItem onClick={handleLogout} disabled={loading}>
                  🚪 Sair
                </MenuItem>

                <MenuItem
                  className="danger"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={loading}
                >
                  🗑️ Excluir conta
                </MenuItem>
              </>
            ) : (
              <ErrorMessage>Erro ao carregar dados</ErrorMessage>
            )}
          </UserModal>
        </ModalOverlay>
      )}

      {showEditModal && (
        <ModalOverlay>
          <EditModal>
            <CloseButton onClick={() => setShowEditModal(false)}>x</CloseButton>
            <h2>Editar Dados de Usuário</h2>

            <Form onSubmit={handleEdit}>
              <FormGroup>
                <Label htmlFor="nameUser">Nome</Label>
                <Input
                  type="text"
                  id="nameUser"
                  name="nameUser"
                  value={editForm.nameUser}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password">Nova Senha (opcional)</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={editForm.password}
                  onChange={handleInputChange}
                  placeholder="Deixe em branco para manter a senha atual"
                />
              </FormGroup>

              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}

              <ButtonGroup>
                <Button
                  type="button"
                  className="secondary"
                  onClick={() => setShowEditModal(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="primary" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </ButtonGroup>
            </Form>
          </EditModal>
        </ModalOverlay>
      )}

      {showConfirmModal && (
        <ModalOverlay>
          <ConfirmModal>
            <h3>Confirmar Exclusão</h3>
            <p>
              Tem certeza que deseja excluir sua conta? Esta ação não pode ser
              desfeita.
            </p>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <ButtonGroup>
              <Button
                className="secondary"
                onClick={() => setShowConfirmModal(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                className="danger"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? "Excluindo..." : "Sim, Excluir"}
              </Button>
            </ButtonGroup>
          </ConfirmModal>
        </ModalOverlay>
      )}
    </UserIconContainer>
  );
}
