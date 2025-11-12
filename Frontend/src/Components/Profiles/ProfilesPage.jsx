import styled from "styled-components";
import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { getProfile } from "../../Services/Profile.Api";
import {
  listAssignedGames,
  startOrResumeGame,
  submitAnswer,
} from "../../Services/Games/GameProgress.Api";
import { useParams } from "react-router-dom";

const breakpoints = {
  tablet: "768px",
  mobileL: "425px",
};

const PageContainer = styled.div`
  background-color: #101010;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  font-family: "Georgia", serif;
  padding: 40px;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 25px 20px;
  }

  @media (max-width: ${breakpoints.mobileL}) {
    padding: 15px 10px;
  }
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 40px 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: white;

  span {
    color: blueviolet;
  }

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.8rem;
  }
`;

const CarouselContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: ${breakpoints.tablet}) {
    gap: 10px;
  }
`;

const CarouselWrapper = styled.div`
  display: flex;
  overflow-x: scroll;
  scroll-behavior: smooth;
  gap: 20px;
  flex-grow: 1;
  padding: 10px 0;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: ${breakpoints.tablet}) {
    gap: 15px;
  }
`;

const GameCard = styled.div`
  flex: 0 0 900px;
  min-height: 550px;
  background: linear-gradient(145deg, #2c2724, #1f1b18);
  border-radius: 16px;
  padding: 50px 40px 40px 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-left: 5px solid #6c00ff;
  color: white;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  @media (max-width: ${breakpoints.tablet}) {
    flex: 0 0 85vw;
    padding: 30px 25px 25px 25px;
    min-height: auto;
  }

  @media (max-width: ${breakpoints.mobileL}) {
    flex: 0 0 90vw;
    padding: 25px 20px 20px 20px;
  }
`;

const GameTitle = styled.h3`
  font-size: 2rem;
  color: blueviolet;
  margin: 0 0 30px 0;
  text-align: center;
  font-weight: 700;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
`;

const GameContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 20px;
`;

const StartPrompt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

const StartText = styled.h4`
  font-size: 1.5rem;
  color: #f0f0f0;
  margin: 0;
  font-weight: 600;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.2rem;
  }
`;

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const QuestionText = styled.p`
  font-size: 1.3rem;
  color: #f0f0f0;
  margin: 0;
  font-weight: 600;
  line-height: 1.6;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.1rem;
  }
`;

const AnswerInput = styled.input`
  width: 100%;
  padding: 16px 24px;
  background-color: #4a4440;
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 1rem;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  transition: all 0.3s;

  &:focus {
    outline: none;
    background-color: #5a5450;
    box-shadow: 0 0 8px rgba(108, 0, 255, 0.3);
  }

  &::placeholder {
    color: #999;
  }

  @media (max-width: ${breakpoints.tablet}) {
    padding: 14px 20px;
    font-size: 0.95rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: ${breakpoints.tablet}) {
    gap: 10px;
  }
`;

const Button = styled.button`
  padding: 12px 30px;
  background-color: blueviolet;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  &:hover {
    background-color: #8b2dff;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #4a4440;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: ${breakpoints.tablet}) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #3a3530;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 20px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, blueviolet, #8b2dff);
  width: ${(props) => props.percentage}%;
  transition: width 0.3s ease;
  border-radius: 4px;
`;

const ProgressInfo = styled.p`
  font-size: 0.9rem;
  color: #b366ff;
  margin: 12px 0 0 0;
  text-align: left;
  font-weight: 500;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 0.85rem;
  }
`;

const FeedbackMessage = styled.p`
  font-size: 1rem;
  color: ${(props) => (props.isCorrect ? "#28a745" : "#dc3545")};
  margin: 15px 0 0 0;
  font-weight: 600;
  text-align: center;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 0.9rem;
  }
`;

const LoadingMessage = styled.p`
  color: #aaa;
  font-size: 1.1rem;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  font-size: 1rem;
  text-align: center;
  margin: 20px 0;
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  ${(props) => (props.direction === "left" ? "left: 0;" : "right: 0;")}
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background-color 0.2s;
  color: white;

  &:hover {
    background-color: blueviolet;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 35px;
    height: 35px;
  }
`;

const ArrowIcon = ({ direction = "right" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: direction === "left" ? "rotate(180deg)" : "none" }}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

ArrowIcon.propTypes = {
  direction: PropTypes.oneOf(["left", "right"]),
};

function GameCardComponent({
  game,
  assignment,
  //   onAnswerSubmitted,
  //   profiles,
}) {
  const [gameState, setGameState] = useState("loading"); // loading, start, playing, feedback
  const [currentPhase, setCurrentPhase] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [phaseProgress, setPhaseProgress] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar dados do jogo ao montar o componente
  useEffect(() => {
    const loadGameData = async () => {
      try {
        const response = await startOrResumeGame(assignment.idAssignment);
        if (response.success) {
          setGameData(response.data);
          setCurrentPhase(response.data.currentPhase || 1);
          setPhaseProgress(response.data.phaseProgress || {});
          setGameState("start");
        }
      } catch (error) {
        console.error("Erro ao carregar dados do jogo:", error);
        setGameState("error");
      }
    };

    loadGameData();
  }, [assignment.idAssignment]);

  const handleStartGame = () => {
    setGameState("playing");
    setCurrentQuestionIndex(0);
    setAnswer("");
    setFeedback(null);
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      setFeedback({
        message: "Por favor, digite uma resposta.",
        isCorrect: false,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const currentPhaseData = gameData.phases.find(
        (p) => p.phaseNumber === currentPhase
      );
      const currentQuestion = currentPhaseData.questions[currentQuestionIndex];

      const response = await submitAnswer(
        assignment.idAssignment,
        currentQuestion.idGameQuestion,
        answer
      );

      if (response.success) {
        const isCorrect = response.data.isCorrect;
        setFeedback({
          message: isCorrect
            ? "✓ Resposta correta!"
            : "✗ Resposta incorreta. Tente novamente!",
          isCorrect,
        });

        if (isCorrect) {
          // Atualizar progresso da fase
          const updatedProgress = { ...phaseProgress };
          if (!updatedProgress[currentPhase]) {
            updatedProgress[currentPhase] = { correct: 0, total: 0 };
          }
          updatedProgress[currentPhase].correct =
            (updatedProgress[currentPhase].correct || 0) + 1;

          setPhaseProgress(updatedProgress);

          // Verificar se passou de fase
          const requiredCorrect = currentPhaseData.requiredCorrectAnswers || 1;
          if (updatedProgress[currentPhase].correct >= requiredCorrect) {
            // Avançar para próxima fase
            setTimeout(() => {
              if (currentPhase < gameData.phases.length) {
                setCurrentPhase(currentPhase + 1);
                setCurrentQuestionIndex(0);
                setAnswer("");
                setFeedback(null);
                setGameState("playing");
              } else {
                // Jogo completo
                setGameState("completed");
              }
            }, 1500);
          } else {
            // Próxima pergunta da mesma fase
            setTimeout(() => {
              const nextIndex =
                (currentQuestionIndex + 1) % currentPhaseData.questions.length;
              setCurrentQuestionIndex(nextIndex);
              setAnswer("");
              setFeedback(null);
            }, 1500);
          }
        } else {
          // Resposta incorreta - limpar para tentar novamente
          setTimeout(() => {
            setAnswer("");
            setFeedback(null);
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
      setFeedback({
        message: "Erro ao enviar resposta. Tente novamente.",
        isCorrect: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (gameState === "loading") {
    return (
      <GameCard>
        <GameTitle>{game.nameGame}</GameTitle>
        <GameContent>
          <LoadingMessage>Carregando jogo...</LoadingMessage>
        </GameContent>
      </GameCard>
    );
  }

  if (gameState === "error") {
    return (
      <GameCard>
        <GameTitle>{game.nameGame}</GameTitle>
        <GameContent>
          <ErrorMessage>Erro ao carregar o jogo. Tente novamente.</ErrorMessage>
        </GameContent>
      </GameCard>
    );
  }

  if (gameState === "start") {
    return (
      <GameCard>
        <GameTitle>{game.nameGame}</GameTitle>
        <GameContent>
          <StartPrompt>
            <StartText>Começar jogo?</StartText>
            <Button onClick={handleStartGame}>Começar</Button>
          </StartPrompt>
        </GameContent>
      </GameCard>
    );
  }

  if (gameState === "completed") {
    return (
      <GameCard>
        <GameTitle>{game.nameGame}</GameTitle>
        <GameContent>
          <StartPrompt>
            <StartText>🎉 Parabéns! Você completou o jogo!</StartText>
            <Button onClick={() => setGameState("start")}>
              Jogar Novamente
            </Button>
          </StartPrompt>
        </GameContent>
      </GameCard>
    );
  }

  // Estado "playing"
  if (!gameData || !gameData.phases) {
    return (
      <GameCard>
        <GameTitle>{game.nameGame}</GameTitle>
        <GameContent>
          <LoadingMessage>Carregando pergunta...</LoadingMessage>
        </GameContent>
      </GameCard>
    );
  }

  const currentPhaseData = gameData.phases.find(
    (p) => p.phaseNumber === currentPhase
  );
  if (!currentPhaseData) {
    return (
      <GameCard>
        <GameTitle>{game.nameGame}</GameTitle>
        <GameContent>
          <ErrorMessage>Fase não encontrada.</ErrorMessage>
        </GameContent>
      </GameCard>
    );
  }

  const currentQuestion = currentPhaseData.questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <GameCard>
        <GameTitle>{game.nameGame}</GameTitle>
        <GameContent>
          <ErrorMessage>Pergunta não encontrada.</ErrorMessage>
        </GameContent>
      </GameCard>
    );
  }

  const phaseStats = phaseProgress[currentPhase] || { correct: 0, total: 0 };
  const requiredCorrect = currentPhaseData.requiredCorrectAnswers || 1;
  const progressPercentage = (phaseStats.correct / requiredCorrect) * 100;

  return (
    <GameCard>
      <div>
        <GameTitle>Fase {currentPhase}</GameTitle>
        <GameContent>
          <QuestionContainer>
            <QuestionText>{currentQuestion.questionText}</QuestionText>
            <AnswerInput
              type="text"
              placeholder="Responda aqui..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !isSubmitting) {
                  handleSubmitAnswer();
                }
              }}
              disabled={isSubmitting}
            />
            <ButtonContainer>
              <Button
                onClick={handleSubmitAnswer}
                disabled={isSubmitting || !answer.trim()}
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </Button>
            </ButtonContainer>
            {feedback && (
              <FeedbackMessage isCorrect={feedback.isCorrect}>
                {feedback.message}
              </FeedbackMessage>
            )}
          </QuestionContainer>
        </GameContent>
      </div>

      <div>
        <ProgressInfo>
          {phaseStats.correct}/{requiredCorrect} respostas corretas. Acerte mais{" "}
          {Math.max(0, requiredCorrect - phaseStats.correct)} pergunta(s) para
          passar de fase.
        </ProgressInfo>
        <ProgressBar>
          <ProgressFill percentage={Math.min(progressPercentage, 100)} />
        </ProgressBar>
      </div>
    </GameCard>
  );
}

GameCardComponent.propTypes = {
  game: PropTypes.shape({
    idGame: PropTypes.number.isRequired,
    nameGame: PropTypes.string.isRequired,
  }).isRequired,
  assignment: PropTypes.shape({
    idAssignment: PropTypes.number.isRequired,
  }).isRequired,
  onAnswerSubmitted: PropTypes.func,
  profiles: PropTypes.array,
};

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [assignedGames, setAssignedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);
  const { idProfile: idProfileFromUrl } = useParams();

  useEffect(() => {
    if (idProfileFromUrl) {
      setSelectedProfileId(idProfileFromUrl);
    }
  }, [idProfileFromUrl]);

  // Carregar perfis ao montar o componente
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const profileResponse = await getProfile();
        const uniqueProfiles = profileResponse.data || [];

        setProfiles(uniqueProfiles);

        if (uniqueProfiles.length > 0) {
          const initialProfileId = uniqueProfiles[0].idProfile;
          setSelectedProfileId(initialProfileId);
        }
      } catch (err) {
        console.error("Erro ao carregar perfis:", err);
        setError("Erro ao carregar a lista de perfis. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Carregar jogos quando o perfil selecionado mudar
  const loadGames = useCallback(async () => {
    if (!selectedProfileId) return;

    try {
      setLoading(true);
      const response = await listAssignedGames(selectedProfileId);

      if (response.success && Array.isArray(response.data)) {
        setAssignedGames(response.data);
      }
    } catch (err) {
      console.error("Erro ao carregar jogos atribuídos:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedProfileId]);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Title>
          Continue seu <span>progresso</span>
        </Title>
        <LoadingMessage>Carregando perfis e jogos...</LoadingMessage>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Title>
          Continue seu <span>progresso</span>
        </Title>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Title>
        Continue seu <span>progresso</span>
      </Title>

      {assignedGames.length > 0 ? (
        <CarouselContainer>
          <NavButton direction="left" onClick={() => scroll("left")}>
            <ArrowIcon direction="left" />
          </NavButton>

          <CarouselWrapper ref={carouselRef}>
            {assignedGames.map((assignment) => (
              <GameCardComponent
                key={assignment.idAssignment}
                game={assignment.game}
                assignment={assignment}
                profiles={profiles}
              />
            ))}
          </CarouselWrapper>

          <NavButton direction="right" onClick={() => scroll("right")}>
            <ArrowIcon direction="right" />
          </NavButton>
        </CarouselContainer>
      ) : (
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <LoadingMessage>
            Nenhum jogo atribuído a este perfil ainda.
          </LoadingMessage>
        </div>
      )}

      {profiles.length === 0 && (
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <LoadingMessage>Nenhum perfil encontrado.</LoadingMessage>
        </div>
      )}
    </PageContainer>
  );
}
