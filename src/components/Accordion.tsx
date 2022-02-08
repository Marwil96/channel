import React from 'react';
import { styled, keyframes } from '@stitches/react';
import { violet, blackA, mauve } from '@radix-ui/colors';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Timestamp } from 'firebase/firestore';
import NotificationRow from './NotificationRow';

const slideDown = keyframes({
  from: { height: 0 },
  to: { height: 'var(--radix-accordion-content-height)' },
});

const slideUp = keyframes({
  from: { height: 'var(--radix-accordion-content-height)' },
  to: { height: 0 },
});

const StyledAccordion = styled(AccordionPrimitive.Root, {
  // borderRadius: 6,
  width: '100%',
  backgroundColor: mauve.mauve6,
  border: `1px solid #000`,
  borderTop: 0,
});

const StyledItem = styled(AccordionPrimitive.Item, {
  overflow: 'hidden',
  marginTop: 1,

  '&:first-child': {
    marginTop: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },

  '&:last-child': {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },

  '&:focus-within': {
    position: 'relative',
    zIndex: 1,
    boxShadow: `0 0 0 2px ${mauve.mauve12}`,
  },
});

const StyledHeader = styled(AccordionPrimitive.Header, {
  all: 'unset',
  display: 'flex',
});

const StyledTrigger = styled(AccordionPrimitive.Trigger, {
  all: 'unset',
  fontFamily: 'inherit',
  backgroundColor: 'transparent',
  padding: '0 20px',
  height: 45,
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: '$3',
  lineHeight: 1,
  color: '$text',
  cursor: 'pointer',
  boxShadow: `0 1px 0 ${mauve.mauve6}`,
  '&[data-state="closed"]': { backgroundColor: 'white' },
  '&[data-state="open"]': { backgroundColor: 'white' },
  '&:hover': { backgroundColor: mauve.mauve2 },
});

const StyledContent = styled(AccordionPrimitive.Content, {
  overflow: 'hidden',
  fontSize: 15,
  color: mauve.mauve11,
  backgroundColor: mauve.mauve2,

  '&[data-state="open"]': {
    animation: `${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1)`,
  },
  '&[data-state="closed"]': {
    animation: `${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1)`,
  },
});

const StyledContentText = styled('div', {
  padding: '15px 0px',
  paddingBottom: 0,
});

const StyledChevron = styled(ChevronDownIcon, {
  color: '$text',
  transition: 'transform 300ms cubic-bezier(0.87, 0, 0.13, 1)',
  '[data-state=open] &': { transform: 'rotate(180deg)' },
});

// Exports
export const Accordion = StyledAccordion;
export const AccordionItem = StyledItem;
export const AccordionTrigger = React.forwardRef(({ children, ...props }:any, forwardedRef) => (
  <StyledHeader>
    <StyledTrigger {...props} ref={forwardedRef}>
      {children}
      <StyledChevron aria-hidden />
    </StyledTrigger>
  </StyledHeader>
));
export const AccordionContent = React.forwardRef(({ children, ...props }:any, forwardedRef) => (
  <StyledContent {...props} ref={forwardedRef}>
    <StyledContentText>{children}</StyledContentText>
  </StyledContent>
));

// Your app...
export const AccordionDemo = ({title, sections} : {sections: any, title?: string}) => (
  <Accordion type="single" defaultValue="item-0" collapsible>

    {sections.map(({title, data, userID} : {title: string, data?: any, userID: string}, index: any) => (
      <AccordionItem value={`item-${index}`}>
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>
          {data.map(({message, author, link, type, timestamp, date, id}: {id: string, message: string, author: any, link: string, type: string, timestamp: Timestamp, date: any}, index: any) => (
            <NotificationRow message={message} author={author} link={link} type={type} timestamp={timestamp} date={date} userID={userID} id={id}/>
          ))}
        </AccordionContent>
      </AccordionItem>)
    )}
  </Accordion>
);

export default AccordionDemo;