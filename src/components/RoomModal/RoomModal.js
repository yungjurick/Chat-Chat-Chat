import React, { useState } from 'react';
import styled from 'styled-components';
import { db, firebase } from '../../firebase'
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../reducers/loading';
import { uuid } from 'uuidv4';

import {
	Header,
	FormLabel,
	FormTextInput,
	FormButton
} from '../../styles/Form'

const RoomModal = ({ isOpened, onClose }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [roomObject, setRoomObject] = useState({
    title: '',
    password: '',
    description: ''
  })

  const onChangeRoomObject = (e, type) => {
    setRoomObject({
      ...roomObject,
      [type]: e.target.value
    })
  }

  const onSubmit = async () => {
    if (title.length < 5) {
      alert('Your room title is too short. Please make it more than 5 characters.');
    } else if (description.length < 5) {
      alert('Your room description is too short. Please make it more than 5 characters.');
    } else {
      dispatch(setLoading(true));
      
      const roomId = uuid()

      // Create Room
      const roomRef = db.collection("chatrooms").doc("room_" + roomId)
      
      await roomRef.set({
        title,
        description,
        password,
        id: roomId
      })

      await roomRef.collection('participants')
        .doc()
        .set({
          uid,
          nickname
        })

      await roomRef.collection('messages')
        .doc()
        .set({
          uid: '',
          content: 'start',
          nickname: '',
          created: firebase.firestore.Timestamp.now().seconds
        })

      dispatch(setLoading(false));

      history.push(`/chat/room/${roomId}`)
    }
  }
  
  const handleClose = () => {
    setRoomObject({
      title: '',
      password: '',
      description: ''
    })

    onClose();
  }

  const { title, description, password } = roomObject;
  const { nickname, uid } = useSelector((state) => (state.user.userProfile || { nickname: '', uid: ''}));

	return (
    <ModalLayout isOpened={isOpened}>
      <ModalContainer>
        <Header>Create a New Room</Header>

        <FormLabel>Room Title</FormLabel>
        <FormTextInput type="text" value={title} onChange={e => onChangeRoomObject(e, 'title')}/>

        <FormLabel>Room Description</FormLabel>
        <FormTextInput type="text" value={description} onChange={e => onChangeRoomObject(e, 'description')}/>

        <FormLabel>Room Password (Optional)</FormLabel>
        <FormTextInput type="password" value={password} onChange={e => onChangeRoomObject(e, 'password')}/>

        <FormButton onClick={() => onSubmit()}>Submit</FormButton>
        <FormButton secondary onClick={() => handleClose()}>Close</FormButton>
      </ModalContainer>
    </ModalLayout>
  )
}

const ModalLayout = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 90;
  background-color: rgba(0, 0, 0, 0.3);
  display: ${props => props.isOpened ? 'flex' : 'none'};
`

const ModalContainer = styled.div`
  width: 400px;
  height: auto;
  background-color: white;
  border-radius: 4px;
  box-shadow: rgba(99, 99, 99, 0.3) 0px 2px 8px 0px;
  padding: 24px 32px;
`

export default RoomModal