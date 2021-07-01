import { db } from '../firebase'

export const SET_ROOMS = 'SET_ROOMS'
export const SET_CHAT_ROOM_ID = 'SET_CHAT_ROOM_ID'
export const SET_CHAT_ROOM_TITLE = 'SET_CHAT_ROOM_TITLE'
export const SET_CHAT_ROOM_DESC = 'SET_CHAT_ROOM_DESC'
export const SET_CHAT_ROOM_PW = 'SET_CHAT_ROOM_PW'
export const ADD_CHAT_PARTICIPANT = 'ADD_CHAT_PARTICIPANT'
export const REMOVE_CHAT_PARTICIPANT = 'REMOVE_CHAT_PARTICIPANT'
export const RESET_CURRENT_CHAT = 'RESET_CURRENT_CHAT'
export const SET_CHAT_MODERATOR = 'SET_CHAT_MODERATOR'

export const setRooms = (rooms) => ({
  type: SET_ROOMS,
  payload: rooms,
});

export const setChatRoomId = (roomId) => ({
  type: SET_CHAT_ROOM_ID,
  payload: roomId,
})

export const setChatRoomTitle = (title) => ({
  type: SET_CHAT_ROOM_TITLE,
  payload: title,
})

export const setChatRoomDesc = (desc) => ({
  type: SET_CHAT_ROOM_DESC,
  payload: desc,
})

export const setChatRoomPw = (pw) => ({
  type: SET_CHAT_ROOM_PW,
  payload: pw,
})

export const addChatParticipant = (p) => ({
  type: ADD_CHAT_PARTICIPANT,
  payload: p
})

export const removeChatParticipant = (p) => ({
  type: REMOVE_CHAT_PARTICIPANT,
  payload: p
})

export const setChatModerator = (p) => ({
  type: SET_CHAT_MODERATOR,
  payload: p
})

export const resetCurrentChat = () => ({
  type: RESET_CURRENT_CHAT
})

const initialState = {
  roomList: [],
  currentChat: {
    roomId: '',
    roomTitle: '',
    roomDesc: '',
    participants: [],
    moderator: null
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

    case SET_CHAT_ROOM_TITLE: {
      return {
        ...state,
        currentChat: {
          ...state.currentChat,
          roomTitle: action.payload
        }
      }
    }

    case SET_CHAT_ROOM_DESC: {
      return {
        ...state,
        currentChat: {
          ...state.currentChat,
          roomDesc: action.payload
        }
      }
    }

    case SET_CHAT_ROOM_PW: {
      return {
        ...state,
        currentChat: {
          ...state.currentChat,
          roomPw: action.payload
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
      const filtered = state.currentChat.participants.filter(p => p.uid !== action.payload);

      return {
        ...state,
        currentChat: {
          ...state.currentChat,
          participants: filtered
        }
      }
    }

    case SET_CHAT_MODERATOR: {
      return {
        ...state,
        currentChat: {
          ...state.currentChat,
          moderator: action.payload
        }
      }
    }

    case RESET_CURRENT_CHAT: {
      const prevRoomId = state.currentChat.roomId;
      const prevCnt = state.currentChat.participants.length;

      console.log("PREVIOUS CHAT INFO:", prevCnt, prevRoomId);

      if (prevCnt === 0) {
        // Delete Room from Firebase
        db.collection("chatrooms").doc("room_" + prevRoomId).delete();

        return {
          roomList: state.roomList.filter(r => r.id !== prevRoomId),
          currentChat: {
            roomId: '',
            roomTitle: '',
            roomDesc: '',
            roomPw: '',
            participants: [],
            moderator: null
          }
        }
      } else {
        return {
          ...state,
          roomList: [],
          currentChat: {
            roomId: '',
            roomTitle: '',
            roomDesc: '',
            roomPw: '',
            participants: [],
            moderator: null
          }
        }
      }
    }

    default:
      return state;
  }
};

export default chat;