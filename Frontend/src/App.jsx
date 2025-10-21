// import { useState } from 'react'
import PHeader from "./Components/Presentation/PHeader";
import PTitle from "./Components/Presentation/PTitle";
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
import HTitle from "./Components/Home/HTitle";
import HB1 from "./Components/Home/HB1";
import GlobalStyle from "../GlobalStyle";
// import HB2 from "./Components/Home/HB2";
// import HB3 from "./Components/Home/HB3";

export default function Presentation() {
  return (
    <>
      <GlobalStyle />
      <PHeader>
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
      <GlobalStyle />
      <LoginPage></LoginPage>
    </>
  );
}

export function SignUp() {
  return (
    <>
      <GlobalStyle />
      <SignUpPage></SignUpPage>
    </>
  );
}

export function Home() {
  return (
    <>
      <GlobalStyle />
      <Header>
        <HTitle>Ratio</HTitle>
      </Header>
      <HB1 />
    </>
  );
}
