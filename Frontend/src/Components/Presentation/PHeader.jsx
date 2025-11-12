import styled from "styled-components";

const breakpoints = {
  tablet: "768px",
  mobileL: "425px",
};

const PHeader = styled.header`
  background-color: black;
  display: flex;
  position: sticky;
  top: 0;
  justify-content: space-between;
  align-items: center;
  padding: 35px;
  box-sizing: border-box;
  margin: 0;
  width: 100%;
  z-index: 10;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 25px 20px;
    height: auto;
  }

  @media (max-width: ${breakpoints.mobileL}) {
    padding: 15px 10px;
  }
`;

export default PHeader;
