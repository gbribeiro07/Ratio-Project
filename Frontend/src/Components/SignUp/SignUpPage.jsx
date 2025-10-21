import styled from "styled-components";
import SignUpForm from "./SignUpForm";

const SignUpP = styled.div`
  background-color: #292929;
  display: flex;
  min-height: 100vh;
  width: 100%;
  margin: 0;
`;

export default function SignUpPage() {
  return (
    <SignUpP>
      <SignUpForm />
    </SignUpP>
  );
}
