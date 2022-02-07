import { styled } from '../stitches.config';
import React from 'react';
import { UpdateIcon } from "@radix-ui/react-icons";
import { keyframes } from '@stitches/react';



const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

const Wrapper = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  animation: `${spin} 800ms infinite linear`,
  width: '100%',
  marginBottom: '3.2rem',

  'svg': {
    width: '3.2rem',
    height: '3.2rem',
  }
});

const Spinner = ({ size, color } : { size?: string, color?: string }) => <Wrapper><UpdateIcon /></Wrapper>;

export default Spinner;