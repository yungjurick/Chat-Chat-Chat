import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import {
  MdModeEdit,
  MdInsertEmoticon,
  MdDeleteForever
} from "react-icons/md";
import {
  setEmojiSelectModalStatus,
  setMessageEditModalStatus,
  setMessageDeleteModalStatus,
  setTargetMessageUid,
  setTargetMessageContent
} from '../../reducers/modal'
import { useSelector, useDispatch } from 'react-redux';

import MessageContent from './MessageContent';

// CONSTANT
const LIKE_EMOJI_UID = 'DaZVIfmk2ij5HZsqnOlv';

const convertTimestampToDate = timestamp => {
  const date = new Date(timestamp*1000).toDateString().split(' ');
  const time = new Date(timestamp*1000).toLocaleTimeString().split(':');

  return `${time[0]}:${time[1]}, ${date[2]} ${date[1]}`
}

const Message = ({
  messageUid,
  onSelectEmoji,
  userData,
  messageData,
  emojiData
}) => {
  const dispatch = useDispatch();

  const { userUid, userNickname } = userData;
  const {
    messageUserUid,
    created,
    content
  } = messageData;
  const {
    emojis,
    availableEmojis
  } = emojiData;

  // States
  const [hoveredMessageUid, setHoveredMessageUid] = useState('');
  const isEmojiSelectModalOpen = useSelector(state => state.modal.isEmojiSelectModalOpen);

  const isUser = userUid === messageUserUid;
  const hasUserClickedLike = () => {
    if (
      Object.keys(emojis).length > 0 &&
      LIKE_EMOJI_UID in emojis
    ) {
      return emojis[LIKE_EMOJI_UID]['clickedUserUids'].findIndex(uid => uid === userUid) >= 0;
    } else {
      return false;
    }
  }

  // Hover Events
  const onMouseEnterHandler = messageId => {
    setHoveredMessageUid(messageId);
  };
  const onMouseLeaveHandler = () => {
    if (!isEmojiSelectModalOpen) {
      setHoveredMessageUid('');
    }
  };

  const onClickIcon = (type, messageUid, content = '') => {
    dispatch(setTargetMessageUid(messageUid));
    switch (type) {
      case 'emoji':
        dispatch(setEmojiSelectModalStatus(true));
        return;
      case 'edit':
        dispatch(setTargetMessageContent(content));
        dispatch(setMessageEditModalStatus(true));
        return;
      case 'delete':
        dispatch(setMessageDeleteModalStatus(true));
        return;
      default:
        return;
    }
  }
  
  return (
    <MessageRow
      onMouseEnter={() => onMouseEnterHandler(messageUid)}
      onMouseLeave={() => onMouseLeaveHandler()}
      isHovered={hoveredMessageUid === messageUid}
    >
      <MessageHeader isUser={isUser}>
        <MessageTitle>{userNickname}</MessageTitle>
        <MessageSubtitle>{convertTimestampToDate(created)}</MessageSubtitle>
      </MessageHeader>
      <MessageContentWrapper isUser={isUser}>
        <MessageContent
          messageUserUid={messageUserUid}
          userUid={userUid}
          content={content}
          messageUid={messageUid}
          onSelectEmoji={onSelectEmoji}
          likeEmojiUid={LIKE_EMOJI_UID}
          hasClickedLike={hasUserClickedLike}
        />
      </MessageContentWrapper>
      {
        Object.keys(emojis).length > 0 && (
          <MessageEmojiContainer>
            {
              Object.keys(emojis).map(emojiUid => {
                const emojiListIndex = availableEmojis.findIndex(obj => obj.uid === emojiUid)
                const { clickedUserUids } = emojis[emojiUid];
                const { imageUrl } = availableEmojis[emojiListIndex];
                const hasClicked = clickedUserUids.findIndex(uid => uid === userUid) >= 0;
                return (
                  <MessageEmojiWrapper
                    key={emojiUid}
                    hasClicked={hasClicked}
                    onClick={() => onSelectEmoji(emojiUid, messageUid, hasClicked)}
                  >
                    <img src={imageUrl} alt="emoji" />
                    <span>{clickedUserUids.length}</span>
                  </MessageEmojiWrapper>
                )
              })
            }
          </MessageEmojiContainer>
        )
      }
      {
        hoveredMessageUid === messageUid &&
        messageUserUid !== '' &&
        (
          <MessageUtilContainer>
            <MessageUtilIconWrapper onClick={() => onClickIcon('emoji', messageUid)}>
              <MdInsertEmoticon/>
            </MessageUtilIconWrapper>
            {
              isUser && (
                <Fragment>
                  <MessageUtilIconWrapper onClick={() => onClickIcon('edit', messageUid, content)}>
                    <MdModeEdit />
                  </MessageUtilIconWrapper>
                  <MessageUtilIconWrapper onClick={() => onClickIcon('delete', messageUid)}>
                    <MdDeleteForever />
                  </MessageUtilIconWrapper>
                </Fragment>
              )
            }
          </MessageUtilContainer>
        )
      }
    </MessageRow>
  )
}

// Styles

const MessageRow = styled.div`
  position: relative;
  padding: 12px 20px;
  width: 100%;
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  & + & {
    /* padding: 12px 0; */
  }
  background-color: ${props => props.isHovered ? 'rgba(0, 0, 0, 0.05)' : 'transparent'};
`

const MessageHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
`

const MessageTitle = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 14px;
`

const MessageSubtitle = styled.span`
  font-size: 10px;
  margin: 0 6px;
`

const MessageContentWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const MessageUtilContainer = styled.div`
  border: 1px solid lightgray;
  width: auto;
  height: auto;
  position: absolute;
  top: 12px;
  right: 20px;
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  background-color: white;
  padding: 4px;
`
const MessageUtilIconWrapper = styled.div`
  padding: 6px;
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: lightgray;
  }
  & + & {
    margin-left: 6px;
  }
`

const MessageEmojiContainer = styled.div`
  padding-top: 10px;
`

const MessageEmojiWrapper = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 50px;
  border-radius: 10px;
  padding: 4px;
  cursor: pointer;
  border: ${props => props.hasClicked ? '1.5px solid #1D3458' : '1.5px solid lightgray'};
  color: ${props => props.hasClicked ? 'white' : 'black'};
  background-color: ${props => props.hasClicked ? '#1D3458' : 'transparent'};

  & > img {
    height: 19px;
    width: 19px;
  }
  & > span {
    font-weight: 600;
    font-size: 12px;
    margin-left: 4px;
  }
  &:hover {
    color: white;
    background-color: #1D3458;
  }
  & + & {
    margin-left: 10px;
  }
`

const areEqual = (prevProps, nextProps) => {
  const hasEqualEmojis = (prevEmojis, nextEmojis) => {
    const prevEmojiUids = Object.keys(prevEmojis).sort();
    const nextEmojiUids = Object.keys(nextEmojis).sort();

    /*
      [Emojis Data Structure]
      - Used a nested object with messageUid as key
      - The value is an object of key:value(s) where key is the emojiUid
      - Nested Objects are used in order to allow components to access the emoji data quickly using key-lookup

      chatEmojis: {
        [messageUid]: emojis,
        ...
      }

      <IN MESSAGE COMPONENT>

      emojis: {
        [emojiUid]: {
          messageUid: String -- messageUid,
          uid: String -- emojiUid,
          clickedUserUids: [userUid1, userUid2, ...] -- Array that stores who clicked this emoji
        },
        ...
      }
    */
    
    // Check if prev and next have same types of emojis
    if (prevEmojiUids.length !== nextEmojiUids.length) {
      return false
    }

    if (prevEmojiUids.every((val, index) => val === nextEmojiUids[index])) {
      // Has Same Type of Emojis for Prev and Next

      // 1. Check if both are empty
      if (prevEmojiUids.length === 0 && nextEmojiUids.length === 0) {
        return true
      }

      // 2. Check clicked counts for emojis
      for (let i = 0; i < prevEmojiUids.length; i++) {
        const prevEmojiClickedCnt = prevEmojis[prevEmojiUids[i]]['clickedUserUids'].sort();
        const nextEmojiClickedCnt = nextEmojis[nextEmojiUids[i]]['clickedUserUids'].sort();
        
        // If not equal, return false
        if (prevEmojiClickedCnt.every((val, index) => val === nextEmojiClickedCnt[index]) === false) {
          return false;
        }
      }

      // If for-loop goes without problem, then prev and next are equal
      return true
    }

    return false;
  }

  return (
    prevProps.messageData.content === nextProps.messageData.content &&
    prevProps.messageUid === nextProps.messageUid &&
    hasEqualEmojis(prevProps.emojiData.emojis, nextProps.emojiData.emojis)
  )
}

export default React.memo(Message, areEqual);