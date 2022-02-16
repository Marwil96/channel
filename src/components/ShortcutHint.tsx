import { keyframes } from '@stitches/react';
import React, { useEffect } from 'react';
import { styled } from '../stitches.config';

const Wrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
})

const ShortCutKey = styled('span', {
  display: 'flex',
  alignItems: 'center',
  marginRight: '1rem',
  background: '#f1f1f1',
  borderRadius: '0.4rem',
  minWidth: '4rem',
  padding: '1rem 1rem',
  fontSize: '1.8rem',
  justifyContent: 'center',
  transition: 'all 0.25s ease-in-out',

  '&.blink':{
    background: '$darkGreen',
  }
})

const ActionText = styled('span', {
  fontSize: '1.8rem',
  fontWeight: '400',
})

const ShortcutHint = ({keys, action, css}: {css?: any, keys: any [], action?: string}) => {
  const keyListener = (e: any) => {
    const ctrlKey = e.ctrlKey || e.metaKey;
    keys.map(({displayed, key}, index: number) => {
      if(key === 'Return') {
        if(e.key === 'Enter' || e.key === 'Return') {
          BlinkShortcut(index)
        }
      } else if(ctrlKey) {
        BlinkShortcut(index)
      } else {
        if(e.key === key) {
          BlinkShortcut(index)
        }
      }
      return null
    })
  }

  useEffect(() => {
  window.addEventListener('keydown', keyListener);

    return () => {
      window.removeEventListener('keydown', keyListener)
    };
  }, []);

  const BlinkShortcut = (index: number) => {
    document.getElementById(`shortcut-${index}`)?.classList.add('blink')
    
    setTimeout(() => {
      document.getElementById(`shortcut-${index}`)?.classList.remove('blink')
    }, 250)
  }
  
  return (
    <Wrapper css={css}>
      {keys.map(({displayed, key}, index: number) => (<ShortCutKey id={`shortcut-${index}`}>{displayed}</ShortCutKey>))}
      {action && (<ActionText>{action}</ActionText>)}
    </Wrapper>
  )
}

export default ShortcutHint;