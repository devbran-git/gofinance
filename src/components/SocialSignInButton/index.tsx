import React from 'react';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';
import { SvgProps } from 'react-native-svg';

import { Button, ImageContainer, Text } from './styles';

interface Props extends RectButtonProps {
  title: string;
  svg: React.FC<SvgProps>;
}

export function SocialSignInButton({ title, svg: Svg, ...rest }: Props) {
  return (
    <Button>
      <ImageContainer>
        <Svg />
      </ImageContainer>

      <Text>{title}</Text>
    </Button>
  );
}
