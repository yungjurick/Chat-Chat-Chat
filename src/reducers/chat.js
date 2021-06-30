import { db } from '../firebase'

export const SET_ROOMS = 'SET_ROOMS'
export const SET_CHAT_ROOM_ID = 'SET_CHAT_ROOM_ID'
export const ADD_CHAT_PARTICIPANT = 'ADD_CHAT_PARTICIPANT'
export const REMOVE_CHAT_PARTICIPANT = 'REMOVE_CHAT_PARTICIPANT'
export const RESET_CURRENT_CHAT = 'RESET_CURRENT_CHAT'

export const setRooms = (rooms) => ({
  type: SET_ROOMS,
  payload: rooms,
});

export const setChatRoomId = (roomId) => ({
  type: SET_CHAT_ROOM_ID,
  payload: roomId,
})

export const addChatParticipant = (uid) => ({
  type: ADD_CHAT_PARTICIPANT,
  payload: uid
})

export const removeChatParticipant = (uid) => ({
  type: REMOVE_CHAT_PARTICIPANT,
  payload: uid
})

export const resetCurrentChat = () => ({
  type: RESET_CURRENT_CHAT
})

const initialState = {
  roomList: [],
  currentChat: {
    roomId: '',
    participants: []
  }
}

const chat = (state = initialState, action) => {
  switch (action.type) {
    case SET_ROOMS:{
      return {
        ...state,
        roomList: action.payload,
      }
    }

    case SET_CHAT_ROOM_ID: {
      return {
        ...state,
        currentChat: {
          ...state.currentChat,
          roomId: action.payload
        }
      }
    }

    case ADD_CHAT_PARTICIPANT: {
      return {
        ...state,
        currentChat: {
          ...state.currentChat,
          participants: [...state.currentChat.participants, action.payload]
        }
      }
    }

    case REMOVE_CHAT_PARTICIPANT: {
      const filtered = state.currentChat.participants.filter(p => p !== action.payload);

      return {
        ...state,
        currentChat: {
          ...state.currentChat,
          participants: filtered
        }
      }
    }

    case RESET_CURRENT_CHAT: {
      const prevRoomId = state.currentChat.roomId;
      const prevCnt = state.currentChat.participants.length;

      console.log("PREVIOUS CHAT INFO:", prevCnt, prevRoomId);

      if (prevCnt === 1) {
        // Delete Room from Firebase
        db.collection("chatrooms").doc("room_" + prevRoomId).delete();

        return {
          roomList: state.roomList.filter(r => r.id !== prevRoomId),
          currentChat: {
            roomId: '',
            participants: []
          }
        }
      } else {
        return {
          ...state,
          currentChat: {
            roomId: '',
            participants: []
          }
        }
      }
    }

    default:
      return state;
  }
};

export default chat;