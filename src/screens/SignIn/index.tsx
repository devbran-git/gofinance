import React from 'react';
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
} from './styles';

import { SocialSignInButton } from '../../components/SocialSignInButton';
import { RFValue } from 'react-native-responsive-fontsize';

import LogoSvg from '../../assets/logo.svg';
import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import { useAuth } from '../../hooks/auth';

export function SignIn() {
  const { user } = useAuth();

  console.log('O que tem no user --->', user);
  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />

          <Title>{`Controle suas\nfinanças de forma\nmuito simples`}</Title>
        </TitleWrapper>
        <SignInTitle>{`Faça seu login com\numa das contas abaixo`}</SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SocialSignInButton title='Entrar com Google' svg={GoogleSvg} />
          <SocialSignInButton title='Entrar com Apple' svg={AppleSvg} />
        </FooterWrapper>
      </Footer>
    </Container>
  );
}
