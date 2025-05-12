import styled from "styled-components";
import menu from "../../assets/menu.png"; //a importação precisa sair duas pastas para encontrar a imagem, por isso dos "../../"

const HMenu = styled.img`
  width: 30px;
  height: 30px;
  object-fit: contain;
`;

function FHMenu() {
  return (
    <div>
      <HMenu src={menu} alt="Menu" />
    </div>
  );
}

export default FHMenu;
