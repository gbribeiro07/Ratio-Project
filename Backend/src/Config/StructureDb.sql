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