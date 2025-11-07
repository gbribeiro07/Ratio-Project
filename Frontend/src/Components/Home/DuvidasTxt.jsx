import styled from "styled-components";
import { Link } from "react-router-dom";

const DuvidasText = styled(Link)`
  color: white;
  margin-right: 60px;
  font-size: 15px;
  text-align: right;
  flex-shrink: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    color: blueviolet;
  }
`;

export default function DuvidasTxt() {
  return <DuvidasText to="/Duvidas">Dúvidas</DuvidasText>;
}
