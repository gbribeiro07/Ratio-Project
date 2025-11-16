# Ratio Project

#### Link (youtube) da apresentação do site: https://www.youtube.com/watch?v=5HSG-n-qsuA

# Introdução

O Ratio é um Software produzido em React e JavaScript com intuito de disponibilizar um ambiente tecnológico propício e simplificado para que pais e mestres possam efetivar a educação, em Lógica e Matemática, de seus filhos e alunos, por meio (principalmente) da criação de jogos de pergunta e resposta.

## Tecnologias (dependências) utilizadas no Frontend:

- "dotenv": "^17.2.1",
- "prop-types": "^15.8.1",
- "react": "^18.3.1",
- "react-dom": "^18.3.1",
- "react-router-dom": "^7.1.3",
- "router": "^2.0.0",
- "styled-components": "^6.1.14"

## Tecnologias (dependências) utilizadas no Backend:

- "bcrypt": "^5.1.1",
- "bcryptjs": "^3.0.2",
- "cookie-parser": "^1.4.7",
- "cors": "^2.8.5",
- "dotenv": "^16.4.7",
- "express": "^4.21.2",
- "jsonwebtoken": "^9.0.2",
- "multer": "^1.4.5-lts.1",
- "mysql2": "^3.12.0",
- "nodemailer": "^6.10.0",
- "nodemon": "^3.1.9",
- "otp-generator": "^4.0.1",
- "sequelize": "^6.37.5",
- "websocket": "^1.0.35"

## Como rodar o Frontend?

Para rodar o Fronetend do projeto, basta ir ao terminal, acessar a pasta "Frontend", instalar as dependências necessárias com a linha "npm install" e, após isso, ainda no terminal, aplicar o comando "npm run dev". Deve-se criar, também, um arquivo ".env" na pasta "Frontend" com a variável "VITE_API_URL" contendo a URL na qual o seu Backend, localmente, está rodando. Isso será importante para conectar Frontend e Backend.

## Como rodar o Backend?

Para rodar o Backend, primeiro será necessário ir ao terminal, acessar a pasta "Backend", instalar as dependências necessárias com a linha "npm install" e criar um arquivo ".env" com as variáveis necessárias (estas que se encontram nos arquivos do Backend). Para facilitar, abaixo está a lista delas:

- PORT=porta em que roda o backend localmente
- CORS_ORIGIN=origem do Frontend (local)
- DB_NAME=nome do banco de dados
- DB_USER=nome do usuário do banco de dados
- DB_PASSWORD=senha do banco de dados
- DB_HOST=localhost
- EMAIL_SUPPORT=endereço de email que enviará email de verificação para usuário
- EMAIL_PASS=senha do endereço de email (recomenda-se que se coloque aqui a "senha para aplicativos" fornecida pela Google aos usuários de Gmail que a solicitarem)
- JWT_SECRET=hash de 64 caracteres
- JWT_EXPIRATION=7d
- JWT_REFRESH_SECRET=outro hash de 64 caracteres
- JWT_REFRESH_EXPIRATION=30d
- LYCEUM_API_URL=http://localhost:3001/Ratio
- NODE_ENV=development

Após isso, é necessário copiar e colar a estrtura do banco de dados e criá-lo na sua máquina, dentro do aplicativo "MySQL". Por fim, se todas as etapas anteriores foram concluídas, basta aplicar "npm start" dentro da pasta "Backend", no terminal, para rodar.
