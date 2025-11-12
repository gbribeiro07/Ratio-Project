import styled from "styled-components";

const breakpoints = {
  tablet: "768px",
  mobileL: "425px",
};

const PTitle = styled.h1`
  color: blueviolet;
  text-align: left;
  flex-grow: 1;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 800;
  font-size: 2.5em;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 2em;
  }

  @media (max-width: ${breakpoints.mobileL}) {
    font-size: 1.5em;
  }
`;

export default PTitle;
