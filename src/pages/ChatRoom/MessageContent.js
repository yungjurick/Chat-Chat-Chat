import React from 'react';
import styled from 'styled-components';

const MessageContent = ({ isUser, content }) => {
  return (
    <MessageContentParag isUser={isUser}>
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

export default MessageContent