import { styled } from '../stitches.config';
  // TODO FIX PRIMARY ERROR

const Button = styled('button', {
  // base styles
  padding: '1rem 1.6rem',
  fontWeight: '400',
  backgroundColor: '$primary',
  outline: 'none',
  border: 'none',
  transition: 'ease 250ms opacity',
  cursor: 'pointer',
  color: '$white',
  fontSize: '$2',
  


  variants: {
    color: {
      black: {backgroundColor: '$bg', color: '$text', border: '1px solid $text','&:hover': {backgroundColor: '#f1f1f1'}},
      white: {backgroundColor: '$text', color: '$bg',  border: '1px solid $text','&:hover': {backgroundColor: '#333'}},
    },

    bordered: {
      true: {backgroundColor: 'none'},
    },

    fullWidth: {
      true: {
        width: '100%',
      }
    },

    size: {
      small: {
        fontSize: '$1',
        padding: '1rem 0.8rem',
      },
      medium: {
        fontSize: '$2',
        padding: '1.2rem 1rem',

      },
      large: {
        fontSize: '$3',
        padding: '1.2rem 1.2rem',
      },
    },
  },
  defaultVariants: {
    color: 'white',
    bordered: false,
    size: 'medium',
  }
});

export default Button;