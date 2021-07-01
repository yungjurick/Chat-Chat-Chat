import React from 'react';
import {
  Layout,
  Container
} from '../../styles/Modal';
import {
  setMessageDeleteModalStatus,
  setTargetMessageUid
} from '../../reducers/modal'
import { useParams } from 'react-router-dom';
import { setLoading } from '../../reducers/loading';
import { db } from '../../firebase'
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

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
const MessageModalContainer = styled(Container)`
  width: 30%;
`
const Content = styled.div`
  padding: 0 12px;
`

const Text = styled.p`
  font-weight: 600;
  margin: 0;
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
  color: ${props => props.type === 'negative' ? 'white' : '#1D3458'};
  & + & {
    margin-left: 12px;
  }
`

export default MessageDeleteModal