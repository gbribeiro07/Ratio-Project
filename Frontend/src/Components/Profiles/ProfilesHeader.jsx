import styled from "styled-components";

const breakpoints = {
  tablet: "768px",
  mobileL: "425px",
};

const ProfilesHeader = styled.header`
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

  @media (max-width: ${breakpoints.tablet}) {
    padding: 25px 20px;
    height: 80px;

    &:hover {
      height: 100px;
    }
  }

  @media (max-width: ${breakpoints.mobileL}) {
    padding: 15px 10px;
    height: 65px;

    &:hover {
      height: 80px;
    }
  }
`;

export default ProfilesHeader;
