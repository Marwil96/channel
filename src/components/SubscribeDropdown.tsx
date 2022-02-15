import React from 'react';
import { styled, keyframes } from '@stitches/react';
import { mauve, blackA } from '@radix-ui/colors';
import {
  HamburgerMenuIcon,
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
} from '@radix-ui/react-icons';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const StyledContent = styled(DropdownMenuPrimitive.Content, {
  minWidth: 220,
  backgroundColor: 'white',
  borderRadius: 6,
  padding: 5,
  boxShadow:
    '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
  '@media (prefers-reduced-motion: no-preference)': {
    animationDuration: '400ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'transform, opacity',
    '&[data-state="open"]': {
      '&[data-side="top"]': { animationName: slideDownAndFade },
      '&[data-side="right"]': { animationName: slideLeftAndFade },
      '&[data-side="bottom"]': { animationName: slideUpAndFade },
      '&[data-side="left"]': { animationName: slideRightAndFade },
    },
  },
});

const itemStyles = {
  all: 'unset',
  fontSize: 13,
  lineHeight: 1,
  color: '$text',
  borderRadius: 3,
  display: 'flex',
  alignItems: 'center',
  height: 25,
  padding: '0 5px',
  position: 'relative',
  paddingLeft: 25,
  userSelect: 'none',

  '&[data-disabled]': {
    color: mauve.mauve8,
    pointerEvents: 'none',
  },

  // '&:focus': {
  //   backgroundColor: '#f1f1f1',
  //   color: '$text',
  // },
};

const StyledItem = styled(DropdownMenuPrimitive.Item, { ...itemStyles, 
  variants: {
    active: {
      true: {
        backgroundColor: '#f1f1f1',
      }
    }
  }
});
const StyledCheckboxItem = styled(DropdownMenuPrimitive.CheckboxItem, { ...itemStyles });
const StyledRadioItem = styled(DropdownMenuPrimitive.RadioItem, { ...itemStyles });
const StyledTriggerItem = styled(DropdownMenuPrimitive.TriggerItem, {
  '&[data-state="open"]': {
    backgroundColor: '$text',
    color: '$text',
  },
  ...itemStyles,
});

const StyledLabel = styled(DropdownMenuPrimitive.Label, {
  paddingLeft: 25,
  fontSize: 12,
  lineHeight: '25px',
  color: mauve.mauve11,
});

const StyledSeparator = styled(DropdownMenuPrimitive.Separator, {
  height: 1,
  backgroundColor: '$text',
  margin: 5,
});

const StyledItemIndicator = styled(DropdownMenuPrimitive.ItemIndicator, {
  position: 'absolute',
  left: 0,
  width: 25,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledArrow = styled(DropdownMenuPrimitive.Arrow, {
  fill: 'white',
});

// Exports
export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent = StyledContent;
export const DropdownMenuItem = StyledItem;
export const DropdownMenuCheckboxItem = StyledCheckboxItem;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
export const DropdownMenuRadioItem = StyledRadioItem;
export const DropdownMenuItemIndicator = StyledItemIndicator;
export const DropdownMenuTriggerItem = StyledTriggerItem;
export const DropdownMenuLabel = StyledLabel;
export const DropdownMenuSeparator = StyledSeparator;
export const DropdownMenuArrow = StyledArrow;

// Your app...
const Box = styled('div', {});

const RightSlot = styled('div', {
  marginLeft: 'auto',
  paddingLeft: 20,
  color: mauve.mauve11,
  ':focus > &': { color: '$text' },
  '[data-disabled] &': { color: mauve.mauve8 },
});

const Trigger = styled('button', {
  unset: 'all',
  fontWeight: '500', 
  textTransform: 'uppercase',
  background: 'none',
  border: 'none',
  fontSize: '$3',
})

const IconButton = styled('button', {
  all: 'unset',
  fontFamily: 'inherit',
  borderRadius: '100%',
  height: 35,
  width: 35,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$text',
  backgroundColor: 'white',
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  '&:hover': { backgroundColor: '$text' },
  '&:focus': { boxShadow: `0 0 0 2px black` },
});

export const SubscribeDropdown = ({allOptions, title, open, onMouseEnter, onMouseLeave}: {allOptions: any [], title?: string, open?: boolean, onMouseEnter?: any, onMouseLeave?: any }) => {
  return (
    <Box>
      <DropdownMenu open={open}>
        <DropdownMenuTrigger asChild>
          {/* <IconButton aria-label="Customise options"> */}
            <Trigger onMouseEnter={onMouseEnter} >{title}</Trigger>
          {/* // </IconButton> */}
        </DropdownMenuTrigger>

        <DropdownMenuContent sideOffset={5} onMouseLeave={onMouseLeave}>
          {allOptions.map(({title, shortCut, onClick, active}: {title: string, shortCut?: string, onClick?: any, active?: boolean}) => (
          <DropdownMenuItem onClick={onClick} active={active}>
            {title}{shortCut && <RightSlot>{shortCut}</RightSlot>}
          </DropdownMenuItem>))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Box>
  );
};

export default SubscribeDropdown;