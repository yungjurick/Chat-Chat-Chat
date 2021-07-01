import React from 'react';
import {
  Layout,
  MessageModalContainer,
  Content,
  Text,
  ButtonContainer,
  Button
} from '../../styles/Modal';
import {
  setMessageDeleteModalStatus,
  setTargetMessageUid
} from '../../reducers/modal'
import { useParams } from 'react-router-dom';
import { setLoading } from '../../reducers/loading';
import { db } from '../../firebase'
import { useDispatch } from 'react-redux';

const MessageDeleteModal = ({ targetMessageUid }) => {
  const dispatch = useDispatch();
  const { roomId } = useParams();

  const handleOnClose = () => {
    dispatch(setMessageDeleteModalStatus(false));
    dispatch(setTargetMessageUid(''));
  }

  const handleOnDelete = async () => {
    console.log("Deleting Message");
    console.log("-Message Room ID:", roomId);
    console.log("-Message UID:", targetMessageUid);
    const messageRef = db.collection('chatrooms')
      .doc('room_' + roomId)
      .collection('messages')
      .doc(targetMessageUid);
    
    dispatch(setLoading(true));
    try {
      await messageRef.delete()
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
          <Text>Are you sure you want to delete this message?</Text>
        </Content>
        <ButtonContainer>
          <Button onClick={() => handleOnClose()}>CLOSE</Button>
          <Button type="negative" onClick={() => handleOnDelete()}>DELETE</Button>
        </ButtonContainer>
      </MessageModalContainer>
    </Layout>
  )
}

export default MessageDeleteModal