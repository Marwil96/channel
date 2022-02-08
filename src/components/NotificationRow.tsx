import { TrashIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { RemoveNotification } from "src/actions/database";
import { styled } from "src/stitches.config";

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '$2 $4',
  border: 0,
  margin:0,
  borderBottom: '1px solid #e4e2e4',
  background: '#F9F8F9',

  '&:first-child': {
    // paddingTop: 0
  },

  '&:last-child': {
    borderBottom: 0
  }
});

const Title = styled('span', {
  fontSize: '$2',
  fontWeigiht: '600',
})

const Lable = styled('span', {
  fontSize: '$2',
  marginBottom: '0.4rem',
  // fontFamily: '$mono',
  fontStyle: 'italic',
  
  'span': {
    fontStyle: 'normal',
  }
})

const ProfileImage = styled('img', {
  width: '3.2rem',
  height: '3.2rem',
  borderRadius: '100%',
  marginRight: '$1',
  objectFit: 'cover'
});

const Username = styled('span', {
  fontSize: '$1',
  fontWeight: '500',
  color: '$mono',
  marginRight: '$4',
})

const ButtonWrapper = styled('button', {
  display: 'flex',
  alignItems: 'center',
  padding: '$1 $1',
  cursor: 'pointer',
});

const NotificationRow = ({message, author, link, type, timestamp, date, id, userID, requestedResponse}: any) => {
  const dateString = new Date(date).toLocaleString();
  const navigate = useNavigate();
  
  return (
    <Wrapper>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <ProfileImage src={author.photoUrl} />
        <div style={{display: 'flex', flexDirection:'column', width: '20rem', marginRight: '2rem'}}>
          <Lable>{type} by <span>{author.displayName}</span> at {dateString}</Lable>
          {/* <Username>{author.displayName}</Username> */}
        </div>
        <div style={{display: 'flex', flexDirection:'column'}}>
          {/* <Lable>Content</Lable> */}
          <Title>{message}</Title>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        {requestedResponse && <ButtonWrapper css={{marginRight: '1.4rem', backgroundColor:'$darkGreen', border: 0, '&:hover': {opacity: 0.5}}} onClick={() => navigate(link)}>Response requested by {author.displayName}</ButtonWrapper>}
        {!requestedResponse && <Lable css={{marginRight: '$3', fontStyle: 'normal', fontFamily: '$mono', textDecoration: 'underline', cursor: 'pointer', '&:hover': {opacity: 0.5}}} onClick={() => navigate(link)}>Go to {type}</Lable>}
        <ButtonWrapper onClick={() => RemoveNotification({userID: userID, id: id})}> 
          <TrashIcon />
        </ButtonWrapper>
      </div>
    </Wrapper>
  )
}

export default NotificationRow;