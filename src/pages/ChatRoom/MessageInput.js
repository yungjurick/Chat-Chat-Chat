import React, { Fragment, useState } from 'react';
import styled from 'styled-components';

const MessageInput = ({ onSubmitMessage }) => {
  const [message, setMessage] = useState('');
  const onChangeMessage = e => setMessage(e.target.value);

  // KeyPress Event on Input
  const handleInputKeyPress = e => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        handleSubmitMessage(message);
      }
    }
  }

  const handleSubmitMessage = (message) => {
    onSubmitMessage(message);
    setMessage('');
  }

  return (
    <Fragment>
      <MessageInputContainer>
        <MessageTextarea type="text" value={message} onChange={e => onChangeMessage(e)} onKeyPress={e => handleInputKeyPress(e)}/>
      </MessageInputContainer>
      <MessageButtonContainer>
      <MessageButton onClick={() => handleSubmitMessage(message)}>
        SEND
      </MessageButton>
      </MessageButtonContainer>
    </Fragment>
  )
}

const MessageInputContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  padding: 12px 20px 0 20px;
`

const MessageTextarea = styled.textarea`
  width: 100%;
  outline: none;
  border-radius: 4px;
  border: 1.5px solid #E6E9EF;
  padding: 12px;
  resize: none;
  font-family: Arial, Helvetica, sans-serif;
`
const MessageButtonContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 8px 20px;
  box-sizing: border-box;
`

const MessageButton = styled.button`
  border: none;
  border-radius: 4px;
  background-color: #78C1FF;
  color: white;
  margin-left: 16px;
  padding: 10px 25px;
  margin-left: auto;
  font-weight: bold;
  cursor: pointer;
`
export default MessageInput