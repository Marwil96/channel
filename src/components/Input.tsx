import { styled } from "src/stitches.config";

const Input = styled('input', {
  all: 'unset',
  width: 'auto',
  flex: '1',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.6rem 1rem',
  fontSize: '$3',
  lineHeight: 1,
  color: '#000',
  boxShadow: '0 0 0 1px #000',
  marginBottom: '0.6rem',

  '&:focus': { boxShadow: `0 0 0 2px #000` },
});

export default Input;