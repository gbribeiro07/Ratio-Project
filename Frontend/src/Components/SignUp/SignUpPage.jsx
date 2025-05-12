import styled from "styled-components";
import SignUpForm from "./SignUpForm";

const SignUpP = styled.div`
  background-color: white;
  display: flex;
  width: 101.05%;
  height: 100%;
  margin-top: 0;
  margin-left: -8px;
`;

export default function SignUpPage() {
  return (
    <SignUpP>
      <SignUpForm />
    </SignUpP>
  );
}
