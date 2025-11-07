import styled from "styled-components";

const Header = styled.header`
  background-color: #000000;
  display: flex;
  position: sticky;
  top: 0;
  justify-content: space-between;
  align-items: center;
  padding: 35px;
  height: 110px;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  z-index: 1000;
  transition: height 0.3s ease-in-out;

  &:hover {
    height: 140px;
  }
`;

export default Header;
