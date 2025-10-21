import styled from "styled-components";
import LoginForm from "./LoginForm";

const LoginP = styled.div`
  background-color: #292929;
  display: flex;
  min-height: 100vh;
  width: 100%;
  margin: 0;
`;

export default function LoginPage() {
  return (
    <LoginP>
      <LoginForm />
    </LoginP>
  );
}
