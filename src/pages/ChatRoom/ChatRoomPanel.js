import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { MdKeyboardBackspace } from "react-icons/md";

import ParticipantList from './ParticipantList';

const ChatRoomPanel = ({
  roomTitle,
  roomDesc,
  roomPw,
  roomId,
  participants
}) => {
  const history = useHistory();
  return (
    <RoomSidePanel>
      <PanelHeader>
        <PanelHeaderButton onClick={() => history.push('/chat/room')}>
          <MdKeyboardBackspace />
        </PanelHeaderButton>
        <PanelChip>
          {
            roomPw.length > 0
            ? (
              <Fragment>
                <PanelChipText>PRIVATE</PanelChipText>
                <PanelChipEmoji role="img" aria-label="lock">🔒</PanelChipEmoji>
              </Fragment>
            )
            : (<PanelChipText>PUBLIC</PanelChipText>)
          }
        </PanelChip>
        <PanelTitle>
          {roomTitle}
        </PanelTitle>
        <PanelSubtitle>
          {roomDesc}
        </PanelSubtitle>
      </PanelHeader>
      <ParticipantListContainer>
        <PanelTitle small>
          Participants ({participants.length})
        </PanelTitle>
        <ParticipantList participants={participants} roomId={roomId}/>
      </ParticipantListContainer>
    </RoomSidePanel>
  )
}

const RoomSidePanel = styled.div`
  width: 100%;
  height: 100%;
  background-color: #1d3557;
  border-radius: 4px 0 0 4px;
  display: grid;
  grid-template-rows: 30% 70%;
  padding: 20px;
`

const PanelHeader = styled.div`
  border-bottom: 1px solid white;
`

const PanelHeaderButton = styled.button`
  border: none;
  padding: 8px 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  margin-bottom: 20px;
  cursor: pointer;
`

const PanelChip = styled.div`
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 3px 6px;
  border-radius: 8px;
  margin-bottom: 4px;
  span + span {
    margin-left: 4px;
  }
`

const PanelChipText = styled.span``

const PanelChipEmoji = styled.span`
  width: 15px;
`

const PanelTitle = styled.p`
  margin: 6px 0;
  color: white;
  font-size: ${props => props.small ? '14px' : '24px'};
  font-weight: bold;
`

const PanelSubtitle = styled.p`
  margin: 0;
  color: white;
  font-size: 12px;
`

const ParticipantListContainer = styled.div`
  display: grid;
  grid-template-rows: 25px auto;
  padding-top: 16px;
`

export default ChatRoomPanel;