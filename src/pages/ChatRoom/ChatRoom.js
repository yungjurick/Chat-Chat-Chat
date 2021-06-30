import React, { useState, useEffect, useRef } from 'react';
import { db, firebaseApp, firebase } from '../../firebase'
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { uuid } from 'uuidv4';
import { Layout, Container } from '../../styles/Chat';
import { MdKeyboardBackspace } from "react-icons/md";
import styled from 'styled-components';

const ChatRoom = () => {
  const { roomId } = useParams();
  const messageListEndRef = useRef(null);

  const [roomName, setRoomName] = useState('');
  const [roomDesc, setRoomDesc] = useState('');

  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [participants, setParticipants] = useState([]);

  const [newMessage, setNewMessage] = useState(null);
  const [modifyMessage, setModifyMessage] = useState(null);

  const [newParticipant, setNewParticipant] = useState(null);

  const userProfile = useSelector(state => state.user.userProfile);

  const { uid: userUid, nickname } = userProfile;

  const onChangeMessage = e => setMessage(e.target.value);

  const onSubmitMessage = async () => {
    if (message.length > 0) {
      const messagePayload = {
        userUid,
        userNickname: nickname,
        content: message,
        uid: uuid(),
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
          .doc()
          .set(messagePayload)
      } catch (e) {
        console.log(e)
      }

      // Scroll Behavior
    
      console.log(messageListEndRef);
      const childCount = messageListEndRef.current?.childElementCount;
      const lastChild = messageListEndRef.current?.children[childCount - 1]

      lastChild.scrollIntoView({ behavior: 'smooth'});
    }        
  }

  const convertTimestampToDate = timestamp => {
    const date = new Date(timestamp*1000).toDateString().split(' ');
    const time = new Date(timestamp*1000).toLocaleTimeString().split(':');

    return `${time[0]}:${time[1]}, ${date[2]} ${date[1]}`
  }

  useEffect(() => {
    const { uid, nickname } = userProfile;

    const getRoomInfo = async () => {
      try {
        const roomRef = db.collection("chatrooms").doc("room_" + roomId);
        const roomDoc = await roomRef.get();
        
        setRoomName(roomDoc.data().title);
        setRoomDesc(roomDoc.data().description);

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
            uid,
            nickname,
            entered: firebase.firestore.Timestamp.now().seconds
          })
      } catch (e) {
        console.log(e)
      }
    }

    getRoomInfo();
    addUserToRoom();
  }, [])

  // Chat Message

  useEffect(() => {
    const chatRef = db.collection('chatrooms').doc('room_' + roomId).collection('messages')
    chatRef.orderBy("created").onSnapshot((snapshot) => {
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
  }, [])

  useEffect(() => {
    if (newMessage) {
      console.log("Add Message")
      const cp = [...chats]
      cp.push(newMessage)
      setChats(cp)
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

  // Chat Participants

  useEffect(() => {
    const chatRef = db.collection('chatrooms').doc('room_' + roomId).collection('participants')
    chatRef.orderBy("entered").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newP = change.doc.data();
          newP.id = change.doc.id
          setNewParticipant(newP);
        }
        if (change.type === "removed") {
          console.log("remove user: ", change.doc.data());
        }
      });
    });
  }, [])

  useEffect(() => {
    if (newParticipant) {
      console.log("New User To Room")
      const newParticipantList = [...participants]
      newParticipantList.push(newParticipant)
      setParticipants(newParticipantList)
    } 
  }, [newParticipant])

  // Event on Leave

  const onLeaveRoom = async () => {
    try {

    } catch (e) {

    }
  }

  useEffect(() => {
    window.onbeforeunload = () => {
        return true;
    };

    return () => {
        window.onbeforeunload = null;
    };
  }, []);

  return (
    <Layout>
      <RoomContainer>
        <RoomSidePanel>
          <PanelHeader>
            <PanelHeaderButton>
              <MdKeyboardBackspace />
            </PanelHeaderButton>
            <PanelTitle>
              {roomName}
            </PanelTitle>
            <PanelSubtitle>
              {roomDesc}
            </PanelSubtitle>
          </PanelHeader>
          <ParticipantListContainer>
            <PanelTitle small>
              Participants
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
                
                return (
                  <MessageRow key={messageUid}>
                    <MessageHeader isUser={isUser}>
                      <MessageTitle>{userNickname}</MessageTitle>
                      <MessageSubtitle>{convertTimestampToDate(created)}</MessageSubtitle>
                    </MessageHeader>
                    <MessageContentWrapper isUser={isUser}>
                      <MessageContent isUser={isUser}>
                        {content}
                      </MessageContent>
                    </MessageContentWrapper>
                    <MessageEmojiContainer>
                      <MessageEmojiWrapper></MessageEmojiWrapper>
                    </MessageEmojiContainer>
                  </MessageRow>
                )
              })
            }
          </MessageList>
          <MessageInputContainer>
            <MessageTextarea type="text" value={message} onChange={e => onChangeMessage(e)}/>
          </MessageInputContainer>
          <MessageButtonContainer>
              <MessageButton onClick={() => onSubmitMessage()}>
                SEND
              </MessageButton>
            </MessageButtonContainer>
        </ChatContainer>
      </RoomContainer>
    </Layout>
  )
}

const RoomContainer = styled(Container)`
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
  padding-top: 16px;
`

const ParticipantList = styled.div``

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
  min-height: 0;
  min-width: 0;
  padding: 20px;
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
  width: 100%;
  & + & {
    margin-top: 8px;
  }
`

const MessageHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  flex-direction: ${props => props.isUser ? 'row-reverse' : 'row'};
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
  flex-direction: ${props => props.isUser ? 'row-reverse' : 'row'};
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

const MessageEmojiContainer = styled.div``

const MessageEmojiWrapper = styled.div``

const MessageInputContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  padding-top: 12px;
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
  padding: 8px 0;
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