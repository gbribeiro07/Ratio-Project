import styled from "styled-components";

const breakpoints = {
  mobileS: "320px",
  mobileL: "425px",
  tablet: "768px",
  laptop: "1024px",
};

const StyledPBottom = styled.footer`
  background-color: #000000;
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  width: 100%;
  padding: 50px 30px 0;
  color: #c9c9c9;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    align-items: center;
    padding: 30px 20px 0;
  }
`;

const FooterBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 25%;
  padding: 0 15px;

  @media (max-width: ${breakpoints.tablet}) {
    width: 90%;
    align-items: center;
    text-align: center;
    margin-bottom: 25px;
    padding: 0;
  }
`;

const BlockTitle = styled.h4`
  color: #ffffff;
  font-size: 1.2em;
  margin-bottom: 15px;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.1em;
  }
`;

const FooterLink = styled.a`
  color: #c9c9c9;
  text-decoration: none;
  margin-bottom: 8px;
  font-size: 0.9em;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: blueviolet;
  }

  @media (max-width: ${breakpoints.tablet}) {
    margin-bottom: 5px;
  }
`;

const CopyrightSection = styled.div`
  width: 100%;
  text-align: center;
  padding: 15px 0;
  border-top: 1px solid #333333;
  color: #888888;
  font-size: 0.8em;
  background-color: #000000;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.mobileL}) {
    font-size: 0.75em;
  }
`;

function PBottom() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <StyledPBottom>
        <FooterBlock>
          <BlockTitle>Ratio</BlockTitle>
          <FooterLink as="p">
            Ratio: Transformando a educação através de jogos e tecnologia.
          </FooterLink>
          <FooterLink as="p">CNPJ: XX.XXX.XXX/0001-XX</FooterLink>
        </FooterBlock>

        <FooterBlock>
          <BlockTitle>Redes Sociais</BlockTitle>
          <FooterLink href="https://instagram.com/ratio">Instagram</FooterLink>
          <FooterLink href="https://facebook.com/ratio">Facebook</FooterLink>
          <FooterLink href="https://twitter.com/ratio">X (Twitter)</FooterLink>
          <FooterLink href="https://linkedin.com/company/ratio">
            LinkedIn
          </FooterLink>
        </FooterBlock>

        <FooterBlock>
          <BlockTitle>Suporte</BlockTitle>
          <FooterLink href="/ajuda">Central de Ajuda</FooterLink>
          <FooterLink href="/faq">FAQ</FooterLink>
          <FooterLink href="/contato">Fale Conosco</FooterLink>
          <FooterLink href="/termos">Termos de Uso</FooterLink>
          <FooterLink href="/privacidade">Política de Privacidade</FooterLink>
        </FooterBlock>

        <FooterBlock>
          <BlockTitle>Contato</BlockTitle>
          <FooterLink as="p">Email: contato@ratio.com.br</FooterLink>
          <FooterLink as="p">Telefone: (51) 9 XXXX-XXXX</FooterLink>
          <FooterLink as="p">Endereço: Rua Fictícia, 123</FooterLink>
        </FooterBlock>
      </StyledPBottom>

      <CopyrightSection>
        &copy; {currentYear} Ratio. Todos os direitos reservados.
      </CopyrightSection>
    </>
  );
}

export default PBottom;
