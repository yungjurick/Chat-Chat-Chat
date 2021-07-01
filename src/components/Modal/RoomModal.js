import React, { useState } from 'react';
import { db, firebase } from '../../firebase'
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../reducers/loading';
import { uuid } from 'uuidv4';
import { setChatRoomModalStatus } from '../../reducers/modal';

import {
  RoomModalLayout,
  RoomModalContainer
} from '../../styles/Modal'
import {
	Header,
	FormLabel,
	FormTextInput,
	FormButton
} from '../../styles/Form'

const RoomModal = () => {
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
      // Initiate Loading
      dispatch(setLoading(true));
      
      const roomId = uuid()

      // Create Room
      const roomRef = db.collection("chatrooms").doc("room_" + roomId)
      
      await roomRef.set({
        title,
        description,
        password,
        id: roomId,
        created: firebase.firestore.Timestamp.now().seconds
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
          userUid: '',
          userNickname: 'Admin',
          content: 'Welcome to the Chat Room! Feel free to talk amongst yourself ;)',
          uid: uuid(),
          created: firebase.firestore.Timestamp.now().seconds,
          likes: [],
          checks: [],
          parrots: [],
          frogs: []
        })

      history.push(`/chat/room/${roomId}`)

      // Finish Loading
      dispatch(setLoading(false));
      dispatch(setChatRoomModalStatus(false));
    }
  }
  
  const handleClose = () => {
    setRoomObject({
      title: '',
      password: '',
      description: ''
    })

    dispatch(setChatRoomModalStatus(false));
  }

  const { title, description, password } = roomObject;
  const { nickname, uid } = useSelector((state) => (state.user.userProfile || { nickname: '', uid: ''}));

	return (
    <RoomModalLayout>
      <RoomModalContainer>
        <Header>Create a New Room</Header>

        <FormLabel>Room Title</FormLabel>
        <FormTextInput type="text" value={title} onChange={e => onChangeRoomObject(e, 'title')}/>

        <FormLabel>Room Description</FormLabel>
        <FormTextInput type="text" value={description} onChange={e => onChangeRoomObject(e, 'description')}/>

        <FormLabel>Room Password (Optional)</FormLabel>
        <FormTextInput type="password" value={password} onChange={e => onChangeRoomObject(e, 'password')}/>

        <FormButton onClick={() => onSubmit()}>Submit</FormButton>
        <FormButton secondary onClick={() => handleClose()}>Close</FormButton>
      </RoomModalContainer>
    </RoomModalLayout>
  )
}

export default RoomModal