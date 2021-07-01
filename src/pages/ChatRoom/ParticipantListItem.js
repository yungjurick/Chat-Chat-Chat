import React from 'react';
import { db } from '../../firebase'
import styled from 'styled-components';

const ParticipantListItem = ({ participant, userUid, moderatorUid, roomId }) => {
  const onKickUser = () => {
    db.collection("chatrooms")
      .doc("room_" + roomId)
      .collection('participants')
      .doc(participant.uid)
      .delete();
  }

  return (
    <ListItem isUser={userUid === participant.uid}>
      <ListItemText>{participant.nickname}</ListItemText>
      {
        moderatorUid === participant.uid && (
          <ListItemBadge>
            MODERATOR 🔥
          </ListItemBadge>
        )
      }
      {
        (userUid === moderatorUid && moderatorUid !== participant.uid) && (
          <ListItemButton onClick={() => onKickUser()}>
            KICK OUT
          </ListItemButton>
        )
      }
    </ListItem>
  )
}

const ListItem = styled.p`
  color: ${props => props.isUser ? 'black' : '#1d3557'};
  padding: 6px;
  border-radius: 4px;
  background-color: white;
  font-size: 10px;
  display: flex;
  height: 30px;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.isUser ? '#78C1FF' : 'white'};
`

const ListItemText = styled.span`
  font-size: 12px;
  font-weight: 600;
  max-width: 50%;
  text-overflow: ellipsis;
  overflow: hidden;
`

const ListItemBadge = styled.span`
  background: #C8E1CC;
  padding: 6px;
  color: #1D3458;
  font-weight: bold;
  border-radius: 6px;
`

const ListItemButton = styled.button`
  background: #E84855;
  padding: 6px;
  color: white;
  font-weight: bold;
  border-radius: 6px;
  font-size: 10px;
  outline: none;
  border: none;
  cursor: pointer;
`

export default ParticipantListItem;