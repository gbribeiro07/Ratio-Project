import styled from "styled-components";
import { Link } from "react-router-dom";

const SignUpText = styled(Link)`
  color: white;
  margin-right: 55px;
  font-size: 15px;
  text-align: right;
  flex-shrink: 0;
  font-family: Arial, sans-serif;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    color: blueviolet;
  }
`;

export default function SignUpTxt() {
  return <SignUpText to="/SignUp">Cadastrar-se</SignUpText>;
}
