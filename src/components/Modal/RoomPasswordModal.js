import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setChatRoomPasswordModalStatus } from '../../reducers/modal';
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

const RoomPasswordModal = ({ roomId, roomPw }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [enteredRoomPw, setEnteredRoomPw] = useState('')

  const onChangePassword = e => setEnteredRoomPw(e.target.value);

  const onSubmit = async () => {
    if (roomPw === enteredRoomPw) {
      history.push(`/chat/room/${roomId}`)
      dispatch(setChatRoomPasswordModalStatus(false));
    } else {
      alert('Incorrect Password. Please Enter the Correct Password.');
    }
  }
  
  const handleClose = () => {
    dispatch(setChatRoomPasswordModalStatus(false));
  }

	return (
    <RoomModalLayout>
      <RoomModalContainer>
        <Header>This is a Private Room</Header>

        <FormLabel>Room Password</FormLabel>
        <FormTextInput type="password" value={enteredRoomPw} onChange={e => onChangePassword(e)}/>

        <FormButton onClick={() => onSubmit()}>Submit</FormButton>
        <FormButton secondary onClick={() => handleClose()}>Close</FormButton>
      </RoomModalContainer>
    </RoomModalLayout>
  )
}

export default RoomPasswordModal