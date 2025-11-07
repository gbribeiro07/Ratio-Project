import styled from "styled-components";
import { Link } from "react-router-dom";

const TeoriaText = styled(Link)`
  color: white;
  margin-right: 70px;
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

export default function TeoriaTxt() {
  return <TeoriaText to="/Teoria">Teoria</TeoriaText>;
}
