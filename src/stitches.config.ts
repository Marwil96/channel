import { createStitches } from '@stitches/react';
import type * as Stitches from '@stitches/react';

export const { styled, getCssText } : {styled: any, getCssText: any} = createStitches({
  media: {
    bp1: '(min-width: 56.25em)',
  },
  
  theme: {
    fonts: {
      system: 'sans-serif',
      text: 'sans-serif',
      mono: 'monospace',
      serif: 'serif',
      title: 'sans-serif'
    },
    colors: {
      black: '#000000',
      text: '#000000',
      bg: '#FFFFFF',
      white: '#FFFFFF',
      // darkGreen: '#05473C',
      darkGreen: '#42bfa3',
      vibrantGreen: '#54ECCA',
    },
    fontSizes: {
      1: '1.2rem',
      2: '1.4rem',
      3: '1.6rem',
      4: '2rem',
      5: '2.4rem',
      6: '3.2rem',
      7: '4.2rem',
      8: '4.8rem',
      9: '6.4rem',
    },
    space: {
      1: '1.2rem',
      2: '1.4rem',
      3: '1.6rem',
      4: '2rem',
      5: '2.4rem',
      6: '3.2rem',
      7: '4.2rem',
      8: '4.8rem',
      9: '6.4rem',
    },
    fontWeights: {},
    lineHeights: {      
      1: '1.2rem',
      2: '1.4rem',
      3: '1.6rem',
      4: '2rem',
      5: '2.4rem',
      6: '3.2rem',
      7: '4.2rem',
      8: '4.8rem',
      9: '6.4rem',
    },
    letterSpacings: {},
    sizes: {      
      1: '1.2rem',
      2: '1.4rem',
      3: '1.6rem',
      4: '2rem',
      5: '2.4rem',
      6: '3.2rem',
      7: '4.2rem',
      8: '4.8rem',
      9: '6.4rem',},
    borderWidths: {},
    borderStyles: {},
    radii: {},
    shadows: {},
    zIndices: {},
    transitions: {},
  },
});