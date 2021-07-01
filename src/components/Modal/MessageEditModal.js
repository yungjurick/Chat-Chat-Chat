import React, { useEffect, useState } from 'react';
import {
  Layout,
  MessageModalContainer,
  Content,
  Textarea,
  ButtonContainer,
  Button
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

export default MessageEditModal