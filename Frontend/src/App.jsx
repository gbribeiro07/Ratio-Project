// import { useState } from 'react'
import PHeader from "./Components/Presentation/PHeader";
import PTitle from "./Components/Presentation/PTitle";
import FPMenu from "./Components/Presentation/PMenu";
import SignUpTxt from "./Components/Presentation/SignUpTxt";
import LoginTxt from "./Components/Presentation/LoginTxt";
import PB1 from "./Components/Presentation/PB1";
import PB2 from "./Components/Presentation/PB2";
import PB3 from "./Components/Presentation/PB3";
import PB4 from "./Components/Presentation/PB4";
import PBottom from "./Components/Presentation/PBottom";
import LoginPage from "./Components/Login/LoginPage";
import SignUpPage from "./Components/SignUp/SignUpPage";
import Header from "./Components/Home/Header";
import HMenu from "./Components/Home/HMenu";
import HTitle from "./Components/Home/HTitle";
import HB1 from "./Components/Home/HB1";
import HB2 from "./Components/Home/HB2";
import HB3 from "./Components/Home/HB3";

export default function Presentation() {
  return (
    <>
      <PHeader>
        <FPMenu>
          <img src="path/to/logo.png" alt="Logo" />{" "}
          {/* Caminho da sua imagem */}
        </FPMenu>
        <PTitle>Ratio</PTitle>
        <SignUpTxt>Cadastrar-se</SignUpTxt>
        <LoginTxt>Login</LoginTxt>
      </PHeader>
      <PB1 />
      <PB2 />
      <PB3 />
      <PB4 />
      <PBottom />
    </>
  );
}

export function Login() {
  return (
    <>
      <LoginPage></LoginPage>
    </>
  );
}

export function SignUp() {
  return (
    <>
      <SignUpPage></SignUpPage>
    </>
  );
}

export function Home() {
  return (
    <>
      <Header>
        <HMenu>
          <img src="path/to/logo.png" alt="Logo" />{" "}
          {/* Caminho da sua imagem */}
        </HMenu>
        <HTitle>Ratio</HTitle>
      </Header>
      <HB1 />
      <HB2 />
      <HB3 />
    </>
  );
}
