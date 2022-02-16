import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform } from 'react-native';
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
} from './styles';

import { useTheme } from 'styled-components';

import { useAuth } from '../../hooks/auth';

import { SocialSignInButton } from '../../components/SocialSignInButton';
import { RFValue } from 'react-native-responsive-fontsize';

import LogoSvg from '../../assets/logo.svg';
import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';

export function SignIn() {
  const { googleSignIn } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();

  async function handleGoogleSignIn() {
    try {
      setIsLoading(true);
      return await googleSignIn();
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível conectar à conta Google');
      setIsLoading(false);
    }
  }

  function handleAppleSignIn() {
    try {
      setIsLoading(true);
      return appleSignIn();
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível conectar à conta Apple');
      setIsLoading(false);
    }
  }

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
          <SocialSignInButton
            title='Entrar com Google'
            svg={GoogleSvg}
            onPress={handleGoogleSignIn}
          />

          {Platform.OS === 'ios' && (
            <SocialSignInButton
              title='Entrar com Apple'
              svg={AppleSvg}
              onPress={handleAppleSignIn}
            />
          )}
        </FooterWrapper>

        {isLoading && (
          <ActivityIndicator
            color={theme.colors.shape}
            style={{ marginTop: 16 }}
          />
        )}
      </Footer>
    </Container>
  );
}
function appleSignIn() {
  throw new Error('Function not implemented.');
}
