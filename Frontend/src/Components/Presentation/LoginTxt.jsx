import styled from "styled-components";
import { Link } from "react-router-dom";

const breakpoints = {
  tablet: "768px",
  mobileL: "425px",
};

const LoginText = styled(Link)`
  color: white;
  margin-right: 20px;
  font-size: 15px;
  text-align: right;
  flex-shrink: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    color: blueviolet;
  }

  @media (max-width: ${breakpoints.tablet}) {
    margin-right: 15px;
    font-size: 14px;
  }

  @media (max-width: ${breakpoints.mobileL}) {
    margin-right: 5px;
    font-size: 13px;
  }
`;

export default function LoginTxt() {
  return <LoginText to="/Login">Login</LoginText>;
}
