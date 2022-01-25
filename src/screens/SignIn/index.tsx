import React from 'react';
import { Text } from 'react-native';
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
} from './styles';

import { RFValue } from 'react-native-responsive-fontsize';

import LogoSvg from '../../assets/logo.svg';
import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';

export function SignIn() {
  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />

          <Title>{`Controle suas\nfinanças de forma\nmuito simples`}</Title>
        </TitleWrapper>
        <SignInTitle>{`Faça seu login com\numa das contas abaixo`}</SignInTitle>
      </Header>

      <Footer></Footer>
    </Container>
  );
}
