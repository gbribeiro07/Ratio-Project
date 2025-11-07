CREATE DATABASE Ratio;

USE Ratio;

CREATE TABLE User (
	idUser INT AUTO_INCREMENT PRIMARY KEY,
    nameUser VARCHAR (100) NOT NULL,
    email VARCHAR (100) UNIQUE NOT NULL,
    password VARCHAR (255) NOT NULL,
    image_profile TEXT,
    status_permission ENUM('SuperAdmin', 'Admin', 'User'),
    date_at_create DATETIME DEFAULT CURRENT_TIMESTAMP,
    isVerified BOOLEAN NOT NULL DEFAULT FALSE,
    verificationToken VARCHAR (6)
);

CREATE TABLE Profiles (
    idProfile INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT NOT NULL, 
    nameProfile VARCHAR(100) NOT NULL, 
    age INT,  -- opcional
    avatar TEXT,  -- imagem de perfil, se desejar
    dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUser) REFERENCES User(idUser)
);

CREATE TABLE Contents (
    idContent INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT NOT NULL,
    contentType ENUM('post', 'video') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUser) REFERENCES User(idUser)
);

CREATE TABLE Questions (
    idQuestion INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT NOT NULL,  -- Quem fez a pergunta
    title VARCHAR (255) NOT NULL, -- Título da pergunta
    description TEXT NOT NULL,  -- Corpo da dúvida
    status ENUM('aberta', 'respondida') DEFAULT 'aberta',  -- Status da dúvida
    dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUser) REFERENCES User(idUser) ON DELETE CASCADE
);

CREATE TABLE Answers (
    idAnswer INT AUTO_INCREMENT PRIMARY KEY,
    idQuestion INT NOT NULL,  -- Qual pergunta está sendo respondida
    idAdmin INT NOT NULL,  -- Qual admin respondeu
    response TEXT NOT NULL,  -- Texto da resposta
    dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idQuestion) REFERENCES Questions(idQuestion) ON DELETE CASCADE,
    FOREIGN KEY (idAdmin) REFERENCES User(idUser) ON DELETE CASCADE
);

CREATE TABLE Games (
    idGame INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT NOT NULL, -- professor que criou o jogo
    nameGame ENUM('Lógica', 'Aritmética', 'Geometria') NOT NULL,
    totalPhases INT DEFAULT 5,
    isPreset BOOLEAN DEFAULT TRUE,  -- indica se é um jogo modelo (não enviado)
    namePreset VARCHAR(100),
    dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUser) REFERENCES User(idUser) ON DELETE CASCADE
);

CREATE TABLE GameAssignments (
    idAssignment INT AUTO_INCREMENT PRIMARY KEY,
    idGame INT NOT NULL,
    idProfile INT NOT NULL,  -- aluno que recebeu o jogo
    dateAssigned DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idGame) REFERENCES Games(idGame) ON DELETE CASCADE,
    FOREIGN KEY (idProfile) REFERENCES Profiles(idProfile) ON DELETE CASCADE
);

CREATE TABLE GamePhases (
    idPhase INT AUTO_INCREMENT PRIMARY KEY,
    idGame INT NOT NULL,
    phaseNumber INT NOT NULL,
    requiredCorrectAnswers INT NOT NULL,
    FOREIGN KEY (idGame) REFERENCES Games(idGame) ON DELETE CASCADE
);

CREATE TABLE GameQuestions (
    idGameQuestion INT AUTO_INCREMENT PRIMARY KEY,
    idPhase INT NOT NULL,
    questionText TEXT NOT NULL,
    FOREIGN KEY (idPhase) REFERENCES GamePhases(idPhase) ON DELETE CASCADE
);

CREATE TABLE GameAnswers (
    idGameAnswer INT AUTO_INCREMENT PRIMARY KEY,
    idGameQuestion INT NOT NULL,
    modelAnswer TEXT NOT NULL,
    FOREIGN KEY (idGameQuestion) REFERENCES GameQuestions(idGameQuestion) ON DELETE CASCADE
);

CREATE TABLE GameResponses (
    idResponse INT AUTO_INCREMENT PRIMARY KEY,
    idAssignment INT NOT NULL,       -- Qual aluno (via envio do jogo)
    idGameQuestion INT NOT NULL,         -- Qual pergunta ele respondeu
    customAnswer TEXT,               -- Resposta digitada
    isCorrect BOOLEAN DEFAULT FALSE, -- Foi uma resposta certa?
    dateAnswered DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idAssignment) REFERENCES GameAssignments(idAssignment) ON DELETE CASCADE,
    FOREIGN KEY (idGameQuestion) REFERENCES GameQuestions(idGameQuestion) ON DELETE CASCADE
);

CREATE TABLE GameProgress (
    idGameProgress INT AUTO_INCREMENT PRIMARY KEY,
    idAssignment INT NOT NULL,
    currentPhase INT DEFAULT 1,
    totalCorrectAnswers INT DEFAULT 0,
    dateUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idAssignment) REFERENCES GameAssignments(idAssignment) ON DELETE CASCADE
);

CREATE TABLE Ranking (
    idRanking INT AUTO_INCREMENT PRIMARY KEY,
    idProfile INT NOT NULL,
    totalCorrectAnswers INT DEFAULT 0,
    lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idProfile) REFERENCES Profiles(idProfile) ON DELETE CASCADE
);