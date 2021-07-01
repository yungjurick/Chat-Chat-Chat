import React from 'react';
import styled from 'styled-components';

const MessageContent = ({
  messageUserUid,
  userUid,
  content,
  messageUid,
  onSelectEmoji,
  likeEmojiUid,
  hasClickedLike
}) => {
  const handleDoubleClick = () => {
    if (messageUserUid !== '') {
      onSelectEmoji(likeEmojiUid, messageUid, hasClickedLike);
    }
  }

  return (
    <MessageContentParag isUser={messageUserUid === userUid} onDoubleClick={() => handleDoubleClick()}>
      {content}
    </MessageContentParag>
  )
}

const MessageContentParag = styled.p`
  background-color: ${props => props.isUser ? '#78C1FF' : 'lightgray'};
  border-radius: 10px;
  padding: 10px;
  display: inline-block;
  max-width: 50%;
  word-wrap: break-word;
  margin: 10px 0 0 0;
`

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.content === nextProps.content &&
    prevProps.hasClickedLike === nextProps.hasClickedLike
  )
}

export default React.memo(MessageContent, areEqual)