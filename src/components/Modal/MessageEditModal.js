import React, { useEffect, useState } from 'react';
import {
  Layout,
  Container
} from '../../styles/Modal';
import {
  setMessageEditModalStatus,
  setTargetMessageContent,
  setTargetMessageUid
} from '../../reducers/modal'
import { useParams } from 'react-router-dom';
import { setLoading } from '../../reducers/loading';
import { db } from '../../firebase'
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const MessageEditModal = ({ targetMessageUid, targetMessageContent }) => {
  const dispatch = useDispatch();
  const { roomId } = useParams();
  
  const [editedMessage, setEditedMessage] = useState('');

  useEffect(() => setEditedMessage(targetMessageContent), []);

  const onChangeEditedMessage = e => setEditedMessage(e.target.value);

  const handleOnClose = () => {
    dispatch(setMessageEditModalStatus(false));
    dispatch(setTargetMessageUid(''));
    dispatch(setTargetMessageContent(''));
  }

  const handleOnEdit = async () => {
    console.log("Editing Message");
    console.log("-Message Room ID:", roomId);
    console.log("-Message UID:", targetMessageUid);
    console.log("-Message (BEFORE):", targetMessageContent);
    console.log("-Message (AFTER):", editedMessage);

    const messageRef = db.collection('chatrooms')
      .doc('room_' + roomId)
      .collection('messages')
      .doc(targetMessageUid);
    
    dispatch(setLoading(true));
    try {
      await messageRef.update({
        content: editedMessage
      })
    } catch (e) {
      console.log(e)
    }
    dispatch(setLoading(false));

    handleOnClose()
  }

  return (
    <Layout>
      <MessageModalContainer>
        <Content>
          <Textarea type="text" value={editedMessage} onChange={e => onChangeEditedMessage(e)}/>
        </Content>
        <ButtonContainer>
          <Button onClick={() => handleOnClose()}>CLOSE</Button>
          <Button type="positive" onClick={() => handleOnEdit()}>EDIT</Button>
        </ButtonContainer>
      </MessageModalContainer>
    </Layout>
  )
}
const MessageModalContainer = styled(Container)`
  width: 30%;
`
const Content = styled.div`
  padding: 0 12px;
`

const Textarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  font-weight: 600;
  margin: 0;
  box-sizing: border-box;
  resize: none;
  overflow: auto;
  outline: none;
  font-family: Arial, Helvetica, sans-serif;
  padding: 12px;
`

const ButtonContainer = styled.div`
  padding: 0 12px;
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
`
const Button = styled.button`
  border-radius: 4px;
  padding: 10px 14px;
  border: none;
  outline: none;
  font-weight: 600;
  cursor: pointer;
  background-color: ${props => {
    if (props.type === 'negative') {
      return '#E84855'
    } else if (props.type === 'positive') {
      return '#63C132'
    } else {
      return '#78C1FF'
    }
  }};
  color: ${props => props.type === 'negative' || props.type === 'positive' ? 'white' : '#1D3458'};
  & + & {
    margin-left: 12px;
  }
`

export default MessageEditModal