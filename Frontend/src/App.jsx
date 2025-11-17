// import { useState } from 'react'
import PHeader from "./Components/Presentation/PHeader";
import PTitle from "./Components/Presentation/PTitle";
import SignUpTxt from "./Components/Presentation/SignUpTxt";
import LoginTxt from "./Components/Presentation/LoginTxt";
import PB1 from "./Components/Presentation/PB1";
import PB2 from "./Components/Presentation/PB2";
import PB3 from "./Components/Presentation/PB3";
import PBottom from "./Components/Presentation/PBottom";
import LoginPage from "./Components/Login/LoginPage";
import SignUpPage from "./Components/SignUp/SignUpPage";
import Header from "./Components/Home/Header";
import HTitle from "./Components/Home/HTitle";
import HB1 from "./Components/Home/HB1";
import GlobalStyle from "../GlobalStyle";
import LabTxt from "./Components/Home/LabTxt";
import TeoriaTxt from "./Components/Home/TeoriaTxt";
import TutoriaisTxt from "./Components/Home/TutoriaisTxt";
import HomeTxt from "./Components/Home/HomeTxt";
import LabPage from "./Components/Lab/LabPage";
import TeoriaPage from "./Components/Teoria/TeoriaPage";
import TutoriaisPage from "./Components/Tutoriais/TutoriaisPage";
import ProfilesHeader from "./Components/Profiles/ProfilesHeader";
import MateriaisTxt from "./Components/Profiles/Materiais.txt";
import SairTxt from "./Components/Profiles/Sair.txt";
import ProfilesPage from "./Components/Profiles/ProfilesPage";
import MateriaisPage from "./Components/Profiles/MateriaisPage";
import UserIcon from "./Components/Home/UserIcon";

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
        <HomeTxt />
        <LabTxt />
        <TeoriaTxt />
        <TutoriaisTxt />
        <UserIcon />
      </Header>
      <HB1 />
    </>
  );
}

export function Lab() {
  return (
    <>
      <GlobalStyle />
      <Header>
        <HTitle>Ratio</HTitle>
        <HomeTxt />
        <LabTxt />
        <TeoriaTxt />
        <TutoriaisTxt />
        <UserIcon />
      </Header>
      <LabPage />
    </>
  );
}

export function Teoria() {
  return (
    <>
      <GlobalStyle />
      <Header>
        <HTitle>Ratio</HTitle>
        <HomeTxt />
        <LabTxt />
        <TeoriaTxt />
        <TutoriaisTxt />
        <UserIcon />
      </Header>
      <TeoriaPage />
    </>
  );
}

export function Tutoriais() {
  return (
    <>
      <GlobalStyle />
      <Header>
        <HTitle>Ratio</HTitle>
        <HomeTxt />
        <LabTxt />
        <TeoriaTxt />
        <TutoriaisTxt />
        <UserIcon />
      </Header>
      <TutoriaisPage />
    </>
  );
}

export function Profiles() {
  return (
    <>
      <GlobalStyle />
      <ProfilesHeader>
        <HTitle>Ratio</HTitle>
        <MateriaisTxt />
        <SairTxt />
      </ProfilesHeader>
      <ProfilesPage />
    </>
  );
}

export function Materiais() {
  return (
    <>
      <GlobalStyle />
      <ProfilesHeader>
        <HTitle>Ratio</HTitle>
        <MateriaisTxt />
        <SairTxt />
      </ProfilesHeader>
      <MateriaisPage />
    </>
  );
}
