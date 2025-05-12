import styled from "styled-components";
import LoginForm from "./LoginForm";

const LoginP = styled.div`
  background-color: white;
  display: flex;
  width: 101.05%;
  height: 100%;
  margin-top: 0;
  margin-left: -8px;
`;

export default function LoginPage() {
  return (
    <LoginP>
      <LoginForm />
    </LoginP>
  );
}
