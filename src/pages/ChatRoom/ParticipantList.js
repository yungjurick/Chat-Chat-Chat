import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import ParticipantListItem from './ParticipantListItem';


const ParticipantList = ({ participants, roomId }) => {
  const moderator = useSelector(state => state.chat.currentChat.moderator);
  const { uid: userUid } = useSelector(state => state.user.userProfile);

  return (
    <List>
      {
        participants.map(p => {
          return (
            <ParticipantListItem key={p.uid} participant={p} userUid={userUid} moderatorUid={moderator.uid} roomId={roomId}/>
          )
        })
      }
    </List>
  )
}

const List = styled.div`
  min-height: 0;
  max-height: 100%;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`

export default ParticipantList;