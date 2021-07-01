import React, { useState, useEffect, useRef } from 'react';
import { db, firebase } from '../../firebase'
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { uuid } from 'uuidv4';
import { Layout, Container } from '../../styles/Chat';
import {
  setChatRoomId,
  addChatParticipant,
  removeChatParticipant,
  setChatRoomTitle,
  setChatRoomDesc,
  setChatRoomPw,
  setChatModerator
} from '../../reducers/chat';
import styled from 'styled-components';

import EmojiSelectModal from '../../components/Modal/EmojiSelectModal';
import Message from './Message';
import MessageInput from './MessageInput';
import ChatRoomPanel from './ChatRoomPanel';
import MessageDeleteModal from '../../components/Modal/MessageDeleteModal';
import MessageEditModal from '../../components/Modal/MessageEditModal';

const ChatRoom = () => {
  const { roomId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const messageListEndRef = useRef(null);

  const [chats, setChats] = useState([]);
  const [chatEmojis, setChatEmojis] = useState({}); // Operate as hash table for easy lookup
  const [availableEmojis, setAvailableEmojis] = useState([]);

  const [newMessage, setNewMessage] = useState(null);
  const [modifyMessage, setModifyMessage] = useState(null);
  const [removeMessage, setRemoveMessage] = useState(null);

  const [newParticipant, setNewParticipant] = useState(null);
  const [removeParticipant, setRemoveParticipant] = useState(null);

  const [newEmoji, setnewEmoji] = useState(null);
  const [modifyEmoji, setModifyEmoji] = useState(null);

  // User Redux State
  const userProfile = useSelector(state => state.user.userProfile);

  // Chat Redux State
  const roomTitle = useSelector(state => state.chat.currentChat.roomTitle);
  const roomDesc = useSelector(state => state.chat.currentChat.roomDesc);
  const roomPw = useSelector(state => state.chat.currentChat.roomPw);
  const participants = useSelector(state => state.chat.currentChat.participants);
  const moderator = useSelector(state => state.chat.currentChat.moderator);

  // Modal Redux State
  const isEmojiSelectModalOpen = useSelector(state => state.modal.isEmojiSelectModalOpen);
  const isMessageEditModalOpen = useSelector(state => state.modal.isMessageEditModalOpen);
  const isMessageDeleteModalOpen = useSelector(state => state.modal.isMessageDeleteModalOpen);
  const targetMessageUid = useSelector(state => state.modal.targetMessageUid);
  const targetMessageContent = useSelector(state => state.modal.targetMessageContent);

  const { uid: userUid, nickname } = userProfile;

  const onSelectEmoji = async (emojiUid, messageUid, isRemove = false) => {
    const emojiRef = db
      .collection('chatrooms')
      .doc('room_' + roomId)
      .collection('messages')
      .doc(messageUid)
      .collection('emojis')

    // Variable to check if it has updated
    let notUpdated = false;

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
      console.log("Error in Updating Emoji Click.", e)
      notUpdated = true;
    }

    // If it does not exist, create a new document
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

  // Submit Event for Message Input
  const onSubmitMessage = async (message) => {
    if (message.length > 0) {
      const messageUid = uuid();
      const messagePayload = {
        userUid,
        userNickname: nickname,
        content: message,
        uid: messageUid,
        created: firebase.firestore.Timestamp.now().seconds
      }

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
        dispatch(setChatRoomPw(roomDoc.data().password));

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
        console.log(e);
      }
    }

    const getEmojis = async () => {
      try {
        const emojiRef = db.collection("emojis")
        const querySnapshot = await emojiRef.get();
        const tempEmojis = []
        querySnapshot.forEach((doc) => {
          tempEmojis.push(doc.data())
        })

        setAvailableEmojis(tempEmojis);

      } catch (e) {
        console.log(e);
      }
    }

    getEmojis();
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
          const data = change.doc.data();
          setRemoveMessage(data);
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
      console.log("Add Message To State")
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
            console.log("removed emoji: ", change.doc.data());
          }
        });
      });
    }
  }, [newMessage])

  useEffect(() => {
    if (modifyMessage) {
      console.log("Modify Message From State")
      const cp = [...chats]
      const index = cp.findIndex(el => el.uid === modifyMessage.uid)
      cp[index] = modifyMessage 
      setChats(cp)
    }
  }, [modifyMessage])

  useEffect(() => {
    if (removeMessage) {
      console.log("Remove Message From State")
      const cp = [...chats].filter(el => el.uid !== removeMessage.uid)
      setChats(cp)
    }
  }, [removeMessage])

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

        if (Object.keys(ce[messageUid]).length === 0) {
          delete ce[messageUid];
        }
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
      
      // If no moderator, set new user as moderator
      // Or, new user has entered earlier than moderator
      // - Double-checking since order of array is not guaranteed
      if (moderator == null || (moderator.entered > newParticipant.entered)) {
        dispatch(setChatModerator(newParticipant))
      }

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

      // If the leaving user is the moderator and there are more than one person in the room
      if (moderator.uid === removeParticipant.uid && participants.length > 1) {
        const sortedParticipants = participants.sort((a, b) => (a.entered > b.entered) ? 1 : -1)
        dispatch(setChatModerator(sortedParticipants[1]))
      }

      // If moderator kicked me out
      if (
        moderator.uid !== userUid &&
        removeParticipant.uid === userUid &&
        participants.length > 1
      ) {
        alert("You've been kicked out of the room by the moderator");
        history.push("/chat/room");
      }

      // Remove Participant from Redux
      dispatch(removeChatParticipant(removeParticipant.uid));
    } 
  }, [removeParticipant])

  // Event Listener
  // - Catch browser leave or close
  // - Remove user in chat from firestore before closing

  const alertUser = e => {
    e.preventDefault();
    e.returnValue = '';
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
        <ChatRoomPanel
          roomTitle={roomTitle}
          roomDesc={roomDesc}
          roomPw={roomPw}
          roomId={roomId}
          participants={participants}
        />
        <ChatContainer>
          <MessageList ref={messageListEndRef}>
            {
              chats.map(({ uid: messageUid, created, content, userNickname, userUid: messageUserUid }) => {
                return (
                  <Message
                    key={messageUid}
                    messageUid={messageUid}
                    onSelectEmoji={onSelectEmoji}
                    userData={{ userUid, userNickname }}
                    messageData={{
                      messageUserUid,
                      created,
                      content
                    }}
                    emojiData={{
                      emojis: (chatEmojis[messageUid] || {}),
                      availableEmojis
                    }}
                  />
                )
              })
            }
          </MessageList>
          <MessageInput onSubmitMessage={onSubmitMessage}/>
        </ChatContainer>
        {/* EMOJI SELECT MODAL */}
        {
          isEmojiSelectModalOpen && (
            <EmojiSelectModal
              targetMessageUid={targetMessageUid}
              onSelectEmoji={onSelectEmoji}
              emojiList={availableEmojis}
            />
          )
        }
        {/* MESSAGE EDIT MODDAL */}
        {
          isMessageEditModalOpen && (
            <MessageEditModal
              targetMessageUid={targetMessageUid}
              targetMessageContent={targetMessageContent}
            />
          )
        }
        {/* MESSAGE DELETE MODDAL */}
        {
          isMessageDeleteModalOpen && (
            <MessageDeleteModal
              targetMessageUid={targetMessageUid}
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

export default ChatRoom