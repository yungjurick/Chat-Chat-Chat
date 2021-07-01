import React, { useState, useEffect, useRef, Fragment } from 'react';
import { db, firebase } from '../../firebase'
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { uuid } from 'uuidv4';
import { Layout, Container } from '../../styles/Chat';
import {
  MdKeyboardBackspace,
  MdModeEdit,
  MdInsertEmoticon,
  MdDeleteForever
} from "react-icons/md";
import {
  setChatRoomId,
  addChatParticipant,
  removeChatParticipant,
  setChatRoomTitle,
  setChatRoomDesc
} from '../../reducers/chat';
import styled from 'styled-components';
import EmojiSelectModal from '../../components/Modal/EmojiSelectModal';

// Test Emoji List
const testEmojiList = [
  {
    uid: 'ee-mm-oo-jj-ii',
    label: 'async-parrot',
    imageUrl: 'https://emojis.slackmojis.com/emojis/images/1597609836/10034/async_parrot.gif?1597609836' 
  },
  {
    uid: 'ee-mm-oo-jj-ii-2',
    label: 'ahhhhh',
    imageUrl: 'https://emojis.slackmojis.com/emojis/images/1558099591/5711/ahhhhhhhhh.gif?1558099591' 
  },
  {
    uid: 'ee-mm-oo-jj-ii-3',
    label: 'banana-dance',
    imageUrl: 'https://emojis.slackmojis.com/emojis/images/1450694616/220/bananadance.gif?1450694616' 
  }
]

const ChatRoom = () => {
  const { roomId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const messageListEndRef = useRef(null);

  const [chats, setChats] = useState([]);
  const [chatEmojis, setChatEmojis] = useState({}); // Operate as hash table for easy lookup

  const [message, setMessage] = useState('');
  const [hoveredMessageUid, setHoveredMessageUid] = useState('');
  const [isEmojiSelectModalOpen, setIsEmojiSelectModalOpen] = useState(false);

  const [newMessage, setNewMessage] = useState(null);
  const [modifyMessage, setModifyMessage] = useState(null);

  const [newParticipant, setNewParticipant] = useState(null);
  const [removeParticipant, setRemoveParticipant] = useState(null);

  const [newEmoji, setnewEmoji] = useState(null);
  const [modifyEmoji, setModifyEmoji] = useState(null);
  const [removeEmoji, setRemoveEmoji] = useState(null);

  const userProfile = useSelector(state => state.user.userProfile);
  const roomTitle = useSelector(state => state.chat.currentChat.roomTitle)
  const roomDesc = useSelector(state => state.chat.currentChat.roomDesc)
  const participants = useSelector(state => state.chat.currentChat.participants)

  const { uid: userUid, nickname } = userProfile;

  const onChangeMessage = e => setMessage(e.target.value);

  // Emoji Select Box Logic
  const onCloseEmojiSelectModal = () => setIsEmojiSelectModalOpen(false);

  const onSelectEmoji = async (emojiUid, messageUid, isRemove = false) => {
    const emojiRef = db
      .collection('chatrooms')
      .doc('room_' + roomId)
      .collection('messages')
      .doc(messageUid)
      .collection('emojis')

    // Variable to check if it has updated
    let notUpdated = false;
    
    console.log(emojiUid, messageUid, isRemove);

    try {
      // First, try updating the clickedUserUids Array if the doc already exists
      // If it is for removing click, remove from array - else, try update

      if (isRemove) {
        // Deactivate Emoji - Remove user uid from array
        console.log("Remove Emoji Click");
        await emojiRef
          .doc(emojiUid)
          .update({
            clickedUserUids: firebase.firestore.FieldValue.arrayRemove(userUid)
          })
      } else {
        // Activate Emoji - Add user uid to array
        console.log("Add Emoji Click");
        await emojiRef
          .doc(emojiUid)
          .update({
            clickedUserUids: firebase.firestore.FieldValue.arrayUnion(userUid)
          })
      }
    } catch (e) {
      // If it does not exist, create a new document
      console.log("Error in Updating Emoji Click.", e)
      notUpdated = true;
    }

    if (notUpdated) {
      console.log("Creating New Emoji Doc in Message.")
      try {
        await emojiRef
          .doc(emojiUid)
          .set({
            messageUid,
            uid: emojiUid,
            clickedUserUids: [userUid]
          })
      } catch (e) {
        console.log(e)
      }
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

  // KeyPress Event on Input
  const handleInputKeyPress = e => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        onSubmitMessage();
      }
    }
  }

  // Submit Event for Message Input
  const onSubmitMessage = async () => {
    if (message.length > 0) {
      const messageUid = uuid();
      const messagePayload = {
        userUid,
        userNickname: nickname,
        content: message,
        uid: messageUid,
        created: firebase.firestore.Timestamp.now().seconds,
        // Emoji Section
        likes: [],
        checks: [],
        parrots: [],
        frogs: []
      }

      // Empty Message State
      setMessage('');

      try {
        // Add message to Firestore
        const chatRef = db.collection('chatrooms').doc('room_' + roomId).collection('messages')
        await chatRef
          .doc(messageUid)
          .set(messagePayload)
      } catch (e) {
        console.log(e)
      }
    }        
  }

  // Utils

  const convertTimestampToDate = timestamp => {
    const date = new Date(timestamp*1000).toDateString().split(' ');
    const time = new Date(timestamp*1000).toLocaleTimeString().split(':');

    return `${time[0]}:${time[1]}, ${date[2]} ${date[1]}`
  }

  const removeUserFromFirestore = (roomId, uid) => {
    console.log("Remove Participant")
    db.collection("chatrooms").doc("room_" + roomId).collection('participants').doc(uid).delete();
  }

  // Initial Fetch For Room Data

  useEffect(() => {
    const getRoomInfo = async () => {
      try {
        const roomRef = db.collection("chatrooms").doc("room_" + roomId);
        const roomDoc = await roomRef.get();

        console.log(roomDoc.data());
        
        dispatch(setChatRoomTitle(roomDoc.data().title));
        dispatch(setChatRoomDesc(roomDoc.data().description));

      } catch (e) {
        console.log(e);
      }
    }

    const addUserToRoom = async () => {
      try {
        // Add User to the Room participant collection
        const participantRef = db.collection("chatrooms").doc("room_" + roomId).collection('participants');
        await participantRef
          .doc(userUid)
          .set({
            uid: userUid,
            nickname,
            entered: firebase.firestore.Timestamp.now().seconds
          })
      } catch (e) {
        console.log(e)
      }
    }

    getRoomInfo();
    addUserToRoom();

    // Update Redux with Room Id
    dispatch(setChatRoomId(roomId));

    return () => {
      removeUserFromFirestore(roomId, userUid);
      dispatch(removeChatParticipant(userUid));
    }
  }, [])

  // Subscriptions on Firestore

  useEffect(() => {
    const chatRef = db
      .collection('chatrooms')
      .doc('room_' + roomId)
      .collection('messages')
      .orderBy("created")

    const unsubscribeChat = chatRef.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newEntry = change.doc.data();
          newEntry.id = change.doc.id
          setNewMessage(newEntry);
        }
        if (change.type === "modified") {
          const data = change.doc.data();
          data.id = change.doc.id
          setModifyMessage(data);  
        }
        if (change.type === "removed") {
          console.log("remove message: ", change.doc.data());
        }
      });
    });

    const participantRef = db
      .collection('chatrooms')
      .doc('room_' + roomId)
      .collection('participants')
      .orderBy("entered");

    const unsubscribeParticipant = participantRef.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newP = change.doc.data();
          setNewParticipant(newP);
        }
        if (change.type === "removed") {
          console.log("remove user: ", change.doc.data());
          const removeP = change.doc.data();
          setRemoveParticipant(removeP);
        }
      });
    });

    return () => {
      unsubscribeChat();
      unsubscribeParticipant();
    }

  }, [])

  useEffect(() => {
    if (newMessage) {
      console.log("Add Message")
      const cp = [...chats]
      cp.push(newMessage)
      setChats(cp)

      // Attach Emoji OnSnapshot Change
      const emojiRef = db
        .collection('chatrooms')
        .doc('room_' + roomId)
        .collection('messages')
        .doc(newMessage.id)
        .collection('emojis')

      emojiRef.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          console.log("Emoji Snapshot Logged");
          if (change.type === "added") {
            const newEmoji = change.doc.data();
            newEmoji.id = change.doc.id
            setnewEmoji(newEmoji);
          }
          if (change.type === "modified") {
            const data = change.doc.data();
            data.id = change.doc.id
            setModifyEmoji(data);  
          }
          if (change.type === "removed") {
            console.log("remove message: ", change.doc.data());
          }
        });
      });
    }
  }, [newMessage])

  useEffect(() => {
    if (modifyMessage) {
      console.log("Modify Message")
      const cp = [...chats]
      const index = cp.findIndex(el => el.uid === modifyMessage.uid)
      cp[index] = modifyMessage 
      setChats(cp)
    }
  }, [modifyMessage])

  useEffect(() => {
    if (newEmoji) {
      console.log("New Emoji", newEmoji)
      const ce = {...chatEmojis}

      ce[newEmoji.messageUid] = {
        ...ce[newEmoji.messageUid],
        [newEmoji.uid]: newEmoji
      };
      setChatEmojis(ce)
    }
  }, [newEmoji])

  useEffect(() => {
    if (modifyEmoji) {
      console.log("Modify Emoji", modifyEmoji)
      const ce = {...chatEmojis}
      const { messageUid, clickedUserUids, uid } = modifyEmoji;

      if (clickedUserUids.length === 0) {
        // Fire event to firestore to delete emoji from message
        db.collection('chatrooms')
          .doc('room_' + roomId)
          .collection('messages')
          .doc(messageUid)
          .collection('emojis')
          .doc(uid)
          .delete();
        
        // Delete emoji from state
        delete ce[messageUid][uid];
      } else {
        // Update the clicked user uids array
        ce[messageUid] = {
          ...ce[messageUid],
          [uid]: {
            ...ce[messageUid][uid],
            clickedUserUids
          }
        };
      }

      setChatEmojis(ce)
    }
  }, [modifyEmoji])

  useEffect(() => {
    if (newParticipant) {
      // Check if user is already in the participants list
      const alreadyInList = participants.findIndex(p => p.uid === newParticipant.uid) >= 0;

      if (!alreadyInList) {
        console.log("Prev Participants List:", participants);
        console.log("New User To Room:", newParticipant);

        // Add Participant to Redux
        dispatch(addChatParticipant(newParticipant));
      }
    } 
  }, [newParticipant])

  useEffect(() => {
    if (removeParticipant) {
      console.log("Remove User From Room:", removeParticipant.nickname)

      // Remove Participant from Redux
      dispatch(removeChatParticipant(newParticipant.uid));
    } 
  }, [removeParticipant])

  // Event Listener
  // - Catch browser leave or close
  // - Remove user in chat from firestore before closing

  const alertUser = e => {
    e.preventDefault();
    e.returnValue = ''
  }

  const handleTabClosing = () => {
    removeUserFromFirestore(roomId, userUid);
  }

  useEffect(() => {
    window.addEventListener('beforeunload', alertUser)
    window.addEventListener('unload', handleTabClosing)
    return () => {
        window.removeEventListener('beforeunload', alertUser)
        window.removeEventListener('unload', handleTabClosing)
    }
  })

  // Scrolling Behavior for New Messages

  useEffect(() => {
    if (messageListEndRef) {
      const childCount = messageListEndRef.current?.childElementCount;
      const lastChild = messageListEndRef.current?.children[childCount - 1]
      if (lastChild) {
        lastChild.scrollIntoView({ behavior: 'smooth'});
      }
    }
  }, [chats])

  return (
    <Layout>
      <RoomContainer>
        <RoomSidePanel>
          <PanelHeader>
            <PanelHeaderButton onClick={() => history.push('/chat/room')}>
              <MdKeyboardBackspace />
            </PanelHeaderButton>
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
            <ParticipantList>
              {
                participants.map(p => {
                  return (
                    <ParticipantListItem key={p.uid}>
                      {p.nickname}
                    </ParticipantListItem>
                  )
                })
              }
            </ParticipantList>
          </ParticipantListContainer>
        </RoomSidePanel>
        <ChatContainer>
          <MessageList ref={messageListEndRef}>
            {
              chats.map(({ uid: messageUid, created, content, userNickname, userUid: messageUserUid, ...emojis }) => {
                const isUser = userUid === messageUserUid
                const isHovered = hoveredMessageUid === messageUid
                return (
                  <MessageRow
                    key={messageUid}
                    onMouseEnter={() => onMouseEnterHandler(messageUid)}
                    onMouseLeave={() => onMouseLeaveHandler()}
                    isHovered={isHovered}
                  >
                    <MessageHeader isUser={isUser}>
                      <MessageTitle>{userNickname}</MessageTitle>
                      <MessageSubtitle>{convertTimestampToDate(created)}</MessageSubtitle>
                    </MessageHeader>
                    <MessageContentWrapper isUser={isUser}>
                      <MessageContent isUser={isUser}>
                        {content}
                      </MessageContent>
                    </MessageContentWrapper>
                    {
                      chatEmojis.hasOwnProperty(messageUid) && (
                        <MessageEmojiContainer>
                          {
                            Object.keys(chatEmojis[messageUid]).map(emojiUid => {
                              const emojiListIndex = testEmojiList.findIndex(obj => obj.uid === emojiUid)
                              const { clickedUserUids } = chatEmojis[messageUid][emojiUid];
                              const { imageUrl } = testEmojiList[emojiListIndex];
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
                      hoveredMessageUid === messageUid && (
                        <MessageUtilContainer>
                          <MessageUtilIconWrapper onClick={() => setIsEmojiSelectModalOpen(true)}>
                            <MdInsertEmoticon/>
                          </MessageUtilIconWrapper>
                          {
                            isUser && (
                              <Fragment>
                                <MessageUtilIconWrapper>
                                  <MdModeEdit />
                                </MessageUtilIconWrapper>
                                <MessageUtilIconWrapper>
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
              })
            }
          </MessageList>
          <MessageInputContainer>
            <MessageTextarea type="text" value={message} onChange={e => onChangeMessage(e)} onKeyPress={e => handleInputKeyPress(e)}/>
          </MessageInputContainer>
          <MessageButtonContainer>
              <MessageButton onClick={() => onSubmitMessage()}>
                SEND
              </MessageButton>
            </MessageButtonContainer>
        </ChatContainer>
        {/* EMOJI SELECT MODAL */}
        {
          isEmojiSelectModalOpen && (
            <EmojiSelectModal
              curMessageUid={hoveredMessageUid}
              onSelectEmoji={onSelectEmoji}
              onClose={onCloseEmojiSelectModal}
              emojiList={testEmojiList}
            />
          )
        }
      </RoomContainer>
    </Layout>
  )
}

const RoomContainer = styled(Container)`
  position: relative;
  padding: 0;
  display: grid;
  grid-template-columns: 30% 70%;
`

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

const PanelTitle = styled.p`
  margin: 0;
  color: white;
  font-size: ${props => props.small ? '14px' : '24px'};
  font-weight: bold;
  margin-bottom: 6px;
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

const ParticipantList = styled.div`
  min-height: 0;
  max-height: 100%;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`

const ParticipantListItem = styled.p`
  color: #1d3557;
  padding: 6px;
  border-radius: 4px;
  background-color: white;
  font-size: 10px;
`

const ChatContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 0 4px 4px 0;
  display: grid;
  grid-template-rows: 80% 13% 7%;
  padding: 20px 0;
  min-height: 0;
  min-width: 0;
  box-sizing: border-box;
`
const MessageList = styled.div`
  max-height: 100%;
  min-height: 0;
  overflow: scroll;
  box-sizing: border-box;
  width: 100%;
  &::-webkit-scrollbar {
    display: none;
  }
  padding-bottom: 10px;
`

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

const MessageContent = styled.p`
  background-color: ${props => props.isUser ? '#78C1FF' : 'lightgray'};
  border-radius: 10px;
  padding: 10px;
  display: inline-block;
  max-width: 50%;
  word-wrap: break-word;
  margin: 10px 0 0 0;
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

const MessageInputContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  padding: 12px 20px 0 20px;
`

const MessageTextarea = styled.textarea`
  width: 100%;
  outline: none;
  border-radius: 4px;
  border: 1.5px solid #E6E9EF;
  padding: 12px;
  resize: none;
  font-family: Arial, Helvetica, sans-serif;
`
const MessageButtonContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 8px 20px;
  box-sizing: border-box;
`

const MessageButton = styled.button`
  border: none;
  border-radius: 4px;
  background-color: #78C1FF;
  color: white;
  margin-left: 16px;
  padding: 10px 25px;
  margin-left: auto;
  font-weight: bold;
  cursor: pointer;
`

export default ChatRoom