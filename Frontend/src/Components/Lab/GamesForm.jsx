import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  createGame,
  assignGameToProfiles,
} from "../../Services/Games/GameContent.Api";
import { getProfile } from "../../Services/Profile.Api";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideDown = keyframes`
  from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const ModalFundo = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalConteudo = styled.form`
  background: linear-gradient(145deg, #2c2724, #1f1b18);
  padding: 40px;
  border-radius: 12px;
  width: 700px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
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
    border-color: #6c00ff;
    outline: none;
    box-shadow: 0 0 5px rgba(108, 0, 255, 0.5);
  }

  &::placeholder {
    color: #888;
  }
`;

const Select = styled.select`
  ${Input};
  height: 44px;
  appearance: none;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  margin-top: 30px;
  display: block;
  width: 100%;
  padding: 12px;
  background-color: blueviolet;
  color: #ffffff;
  font-weight: bold;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #42007f;
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

const SectionTitle = styled.h3`
  margin-top: 25px;
  margin-bottom: 15px;
  color: #6c00ff;
  border-bottom: 1px solid #4a4440;
  padding-bottom: 5px;
  text-align: left;
`;

const PhaseContainer = styled.div`
  border: 1px solid #4a4440;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #26221f;
`;

const FlexRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 15px;
`;

const AddButton = styled.button`
  padding: 8px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  margin-right: 10px;

  &:hover {
    background-color: #218838;
  }
`;

const RemoveButton = styled.button`
  padding: 8px 15px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #c82333;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const HiddenInput = styled(Input)`
  margin-top: 10px;
  margin-bottom: 20px;
`;

const ProfileListContainer = styled.div`
  border: 1px solid #4a4440;
  padding: 15px;
  margin-top: 10px;
  max-height: 150px;
  overflow-y: auto;
  border-radius: 8px;
`;

const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #333;

  &:last-child {
    border-bottom: none;
  }
`;

const initialPhaseState = {
  requiredCorrectAnswers: 1,
  questions: [
    {
      questionText: "",
      answers: [{ modelAnswer: "" }],
    },
  ],
};

export default function GamesForm({ onClose, onGameCreated }) {
  const [nameGame, setNameGame] = useState("Lógica");
  const [totalPhases, setTotalPhases] = useState(5);
  const [phases, setPhases] = useState([initialPhaseState]);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [saveAsPreset, setSaveAsPreset] = useState(true);
  const [namePreset, setNamePreset] = useState("");
  const [sendToProfiles, setSendToProfiles] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [profilesLoading, setProfilesLoading] = useState(false);
  const [createdGameId, setCreatedGameId] = useState(null);

  useEffect(() => {
    if (sendToProfiles && profiles.length === 0) {
      const fetchProfiles = async () => {
        setProfilesLoading(true);
        try {
          const response = await getProfile();
          if (response && response.data) {
            setProfiles(response.data);
          }
        } catch (error) {
          console.error("Erro ao buscar perfis:", error);
          setMessage({ text: "Erro ao carregar perfis.", error: true });
        } finally {
          setProfilesLoading(false);
        }
      };
      fetchProfiles();
    }
  }, [sendToProfiles, profiles.length]);

  const handlePhaseChange = (index, field, value) => {
    const newPhases = [...phases];
    newPhases[index][field] = parseInt(value, 10);
    setPhases(newPhases);
  };

  const handleQuestionChange = (phaseIndex, questionIndex, value) => {
    const newPhases = [...phases];
    newPhases[phaseIndex].questions[questionIndex].questionText = value;
    setPhases(newPhases);
  };

  const handleAnswerChange = (
    phaseIndex,
    questionIndex,
    answerIndex,
    value
  ) => {
    const newPhases = [...phases];
    newPhases[phaseIndex].questions[questionIndex].answers[
      answerIndex
    ].modelAnswer = value;
    setPhases(newPhases);
  };

  const addPhase = () => {
    setPhases([
      ...phases,
      { ...initialPhaseState, phaseNumber: phases.length + 1 },
    ]);
  };

  const removePhase = (index) => {
    const newPhases = phases.filter((_, i) => i !== index);
    setPhases(newPhases.map((p, i) => ({ ...p, phaseNumber: i + 1 })));
  };

  const addQuestion = (phaseIndex) => {
    const newPhases = [...phases];
    newPhases[phaseIndex].questions.push({
      questionText: "",
      answers: [{ modelAnswer: "" }],
    });
    setPhases(newPhases);
  };

  const removeQuestion = (phaseIndex, questionIndex) => {
    const newPhases = [...phases];
    newPhases[phaseIndex].questions.splice(questionIndex, 1);
    setPhases(newPhases);
  };

  const handleProfileSelect = (idProfile) => {
    setSelectedProfiles((prev) =>
      prev.includes(idProfile)
        ? prev.filter((id) => id !== idProfile)
        : [...prev, idProfile]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (!namePreset.trim() && saveAsPreset) {
      setMessage({
        text: "O nome do Preset é obrigatório para salvar!",
        error: true,
      });
      return;
    }
    if (!saveAsPreset && !sendToProfiles) {
      setMessage({
        text: "O jogo deve ser salvo como Preset ou enviado a perfis.",
        error: true,
      });
      return;
    }

    const phaseErrors = phases.some((p) =>
      p.questions.some(
        (q) =>
          !q.questionText.trim() || q.answers.some((a) => !a.modelAnswer.trim())
      )
    );
    if (phaseErrors) {
      setMessage({
        text: "Preencha todas as perguntas e respostas modelo.",
        error: true,
      });
      return;
    }

    setIsLoading(true);

    const gameData = {
      nameGame,
      totalPhases: parseInt(totalPhases, 10),
      namePreset:
        namePreset.trim() ||
        `Jogo ${nameGame} - ${new Date().toLocaleString()}`,
      phases: phases.map((p, index) => ({
        phaseNumber: index + 1,
        requiredCorrectAnswers: p.requiredCorrectAnswers,
        questions: p.questions.map((q) => ({
          questionText: q.questionText,
          answers: q.answers,
        })),
      })),
    };

    try {
      const response = await createGame(gameData);

      if (response.success) {
        setMessage({
          text: "Preset criado com sucesso! Agora você pode enviá-lo.",
          error: false,
        });
        setCreatedGameId(response.data.idGame);

        if (!sendToProfiles) {
          onGameCreated();
          setTimeout(onClose, 1500);
        }
      } else {
        setMessage({
          text: response.message || "Erro ao criar jogo.",
          error: true,
        });
      }
    } catch (error) {
      setMessage({
        text: error.message || "Não foi possível conectar ao servidor.",
        error: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignmentSubmit = async () => {
    setMessage(null);
    if (!createdGameId) {
      setMessage({
        text: "Crie o jogo primeiro antes de enviar.",
        error: true,
      });
      return;
    }
    if (selectedProfiles.length === 0) {
      setMessage({
        text: "Selecione pelo menos um perfil para enviar o jogo.",
        error: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await assignGameToProfiles(
        createdGameId,
        selectedProfiles
      );

      if (response.success) {
        setMessage({
          text: `Jogo enviado com sucesso para ${selectedProfiles.length} perfil(is)!`,
          error: false,
        });
        onGameCreated();
        setTimeout(onClose, 1500);
      } else {
        setMessage({
          text: response.message || "Erro ao enviar jogo.",
          error: true,
        });
      }
    } catch (error) {
      setMessage({
        text: error.message || "Erro de conexão ao enviar jogo.",
        error: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalFundo onClick={onClose}>
      <ModalConteudo
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose} type="button">
          ×
        </CloseButton>

        <Title>Criar Novo Jogo (Preset)</Title>

        <SectionTitle>Configuração Básica</SectionTitle>
        <Label htmlFor="gameType">Tipo de Jogo</Label>
        <Select
          id="gameType"
          value={nameGame}
          onChange={(e) => setNameGame(e.target.value)}
        >
          <option value="Lógica">Lógica</option>
          <option value="Aritmética">Aritmética</option>
          <option value="Geometria">Geometria</option>
        </Select>

        <Label htmlFor="totalPhases">Número Total de Fases (Padrão: 5)</Label>
        <Input
          id="totalPhases"
          type="number"
          placeholder="5"
          value={totalPhases}
          onChange={(e) => setTotalPhases(e.target.value)}
          min="1"
        />

        <SectionTitle>Conteúdo do Jogo</SectionTitle>

        {phases.map((phase, phaseIndex) => (
          <PhaseContainer key={phaseIndex}>
            <FlexRow style={{ justifyContent: "space-between" }}>
              <SectionTitle style={{ marginTop: "0", border: "none" }}>
                FASE {phaseIndex + 1}
              </SectionTitle>
              {phases.length > 1 && (
                <RemoveButton
                  type="button"
                  onClick={() => removePhase(phaseIndex)}
                >
                  Remover Fase
                </RemoveButton>
              )}
            </FlexRow>

            <Label htmlFor={`required-${phaseIndex}`}>
              Acertos Necessários para Passar de Fase
            </Label>
            <Input
              id={`required-${phaseIndex}`}
              type="number"
              value={phase.requiredCorrectAnswers}
              onChange={(e) =>
                handlePhaseChange(
                  phaseIndex,
                  "requiredCorrectAnswers",
                  e.target.value
                )
              }
              min="1"
            />

            <Label style={{ marginTop: "15px" }}>
              Perguntas e Respostas Modelo
            </Label>
            {phase.questions.map((question, questionIndex) => (
              <div
                key={questionIndex}
                style={{
                  border: "1px solid #333",
                  padding: "10px",
                  borderRadius: "5px",
                  marginBottom: "10px",
                }}
              >
                <FlexRow
                  style={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Label
                    htmlFor={`q-${phaseIndex}-${questionIndex}`}
                    style={{ margin: "0", flexGrow: "1" }}
                  >
                    Pergunta {questionIndex + 1}
                  </Label>
                  {phase.questions.length > 1 && (
                    <RemoveButton
                      type="button"
                      onClick={() => removeQuestion(phaseIndex, questionIndex)}
                      style={{ marginTop: "0" }}
                    >
                      Remover
                    </RemoveButton>
                  )}
                </FlexRow>
                <Input
                  id={`q-${phaseIndex}-${questionIndex}`}
                  type="text"
                  placeholder="Digite o texto da pergunta"
                  value={question.questionText}
                  onChange={(e) =>
                    handleQuestionChange(
                      phaseIndex,
                      questionIndex,
                      e.target.value
                    )
                  }
                />

                <Label
                  htmlFor={`a-${phaseIndex}-${questionIndex}`}
                  style={{ marginTop: "10px" }}
                >
                  Resposta Correta Modelo (Case-Insensitive no Controller)
                </Label>
                <Input
                  id={`a-${phaseIndex}-${questionIndex}`}
                  type="text"
                  placeholder="Resposta exata esperada (Ex: 8)"
                  value={question.answers[0].modelAnswer}
                  onChange={(e) =>
                    handleAnswerChange(
                      phaseIndex,
                      questionIndex,
                      0,
                      e.target.value
                    )
                  }
                />
              </div>
            ))}
            <AddButton type="button" onClick={() => addQuestion(phaseIndex)}>
              + Adicionar Pergunta
            </AddButton>
          </PhaseContainer>
        ))}
        <AddButton type="button" onClick={addPhase}>
          + Adicionar Nova Fase
        </AddButton>

        <SectionTitle>Opções de Ação</SectionTitle>

        <CheckboxContainer>
          <input
            type="checkbox"
            id="savePreset"
            checked={saveAsPreset}
            onChange={(e) => setSaveAsPreset(e.target.checked)}
            style={{ marginRight: "10px" }}
          />
          <Label
            htmlFor="savePreset"
            style={{ margin: "0", cursor: "pointer" }}
          >
            Salvar como Preset (Necessário para envio futuro)
          </Label>
        </CheckboxContainer>

        {saveAsPreset && (
          <>
            <Label htmlFor="presetName">Nome do Preset *</Label>
            <HiddenInput
              id="presetName"
              type="text"
              placeholder="Ex: Tabuada Nível Fácil"
              value={namePreset}
              onChange={(e) => setNamePreset(e.target.value)}
            />
          </>
        )}

        <CheckboxContainer>
          <input
            type="checkbox"
            id="sendProfiles"
            checked={sendToProfiles}
            onChange={(e) => {
              setSendToProfiles(e.target.checked);
              if (!e.target.checked) setSelectedProfiles([]);
            }}
            style={{ marginRight: "10px" }}
          />
          <Label
            htmlFor="sendProfiles"
            style={{ margin: "0", cursor: "pointer" }}
          >
            Enviar para um ou mais Perfis (Alunos)
          </Label>
        </CheckboxContainer>

        {sendToProfiles && (
          <>
            <Label>Selecione os Perfis para Envio:</Label>
            <ProfileListContainer>
              {profilesLoading && <p>Carregando perfis...</p>}
              {!profilesLoading && profiles.length === 0 && (
                <p>Nenhum perfil encontrado.</p>
              )}
              {profiles.map((profile) => (
                <ProfileItem key={profile.idProfile}>
                  <span>
                    {profile.nameUser || `Perfil #${profile.idProfile}`}
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedProfiles.includes(profile.idProfile)}
                    onChange={() => handleProfileSelect(profile.idProfile)}
                  />
                </ProfileItem>
              ))}
            </ProfileListContainer>
          </>
        )}

        {message && <Message error={message.error}>{message.text}</Message>}

        {createdGameId && sendToProfiles && !message.error ? (
          <SubmitButton
            type="button"
            onClick={handleAssignmentSubmit}
            disabled={isLoading || selectedProfiles.length === 0}
          >
            {isLoading
              ? "Enviando..."
              : `Enviar Jogo para ${selectedProfiles.length} Perfil(is)`}
          </SubmitButton>
        ) : (
          <SubmitButton
            type="submit"
            disabled={isLoading || (!saveAsPreset && !sendToProfiles)}
          >
            {isLoading
              ? "Processando..."
              : saveAsPreset
              ? "Criar e Salvar Preset"
              : "Criar Jogo Temporário"}
          </SubmitButton>
        )}
      </ModalConteudo>
    </ModalFundo>
  );
}

GamesForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onGameCreated: PropTypes.func.isRequired,
};
