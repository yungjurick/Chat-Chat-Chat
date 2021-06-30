import { db } from '../firebase'

export const SET_ROOMS = 'SET_ROOMS'
export const SET_CHAT_ROOM_ID = 'SET_CHAT_ROOM_ID'
export const INCREMENT_CHAT_PARTICIPANT_COUNT = 'INCREMENT_CHAT_PARTICIPANT_COUNT'
export const DECREMENT_CHAT_PARTICIPANT_COUNT = 'DECREMENT_CHAT_PARTICIPANT_COUNT'
export const RESET_CURRENT_CHAT = 'RESET_CURRENT_CHAT'

export const setRooms = (rooms) => ({
  type: SET_ROOMS,
  payload: rooms,
});

export const setChatRoomId = (roomId) => ({
  type: SET_CHAT_ROOM_ID,
  payload: roomId,
})

export const incrementChatParticipantCount = () => ({
  type: INCREMENT_CHAT_PARTICIPANT_COUNT,
})

export const decrementChatParticipantCount = () => ({
  type: DECREMENT_CHAT_PARTICIPANT_COUNT,
})

export const resetCurrentChat = () => ({
  type: RESET_CURRENT_CHAT
})

const initialState = {
  roomList: [],
  currentChat: {
    roomId: '',
    participantCnt: 0
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

    case INCREMENT_CHAT_PARTICIPANT_COUNT: {
      return {
        ...state,
        currentChat: {
          ...state.currentChat,
          participantCnt: state.currentChat.participantCnt + 1
        }
      }
    }

    case DECREMENT_CHAT_PARTICIPANT_COUNT: {
      const prevCnt = state.currentChat.participantCnt;
      const curCnt = action.payload;

      if (curCnt === 0 && prevCnt === 1) {
        db.collection("chatrooms").doc("room_" + state.currentChat.roomId).delete();
      }

      return {
        ...state,
        currentChat: {
          ...state.currentChat,
          participantCnt: state.currentChat.participantCnt - 1
        }
      }
    }

    case RESET_CURRENT_CHAT: {
      const prevCnt = state.currentChat.participantCnt;

      if (prevCnt === 1) {
        db.collection("chatrooms").doc("room_" + state.currentChat.roomId).delete();
      }

      return {
        ...state,
        currentChat: {
          roomId: '',
          participantCnt: 0
        }
      }
    }

    default:
      return state;
  }
};

export default chat;