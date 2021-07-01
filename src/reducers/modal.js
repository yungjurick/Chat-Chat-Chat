export const SET_CHAT_ROOM_MODAL_STATUS = "SET_CHAT_ROOM_MODAL_STATUS"
export const SET_MESSAGE_DELETE_MODAL_STATUS = "SET_MESSAGE_DELETE_MODAL_STATUS"
export const SET_MESSAGE_EDIT_MODAL_STATUS = "SET_MESSAGE_EDIT_MODAL_STATUS"
export const SET_EMOJI_SELECT_MODAL_STATUS = "SET_EMOJI_SELECT_MODAL_STATUS"

export const SET_TARGET_MESSAGE_UID = "SET_TARGET_MESSAGE_UID"
export const SET_TARGET_MESSAGE_CONTENT = "SET_TARGET_MESSAGE_CONTENT"

export const setChatRoomModalStatus = (status) => ({
  type: SET_CHAT_ROOM_MODAL_STATUS,
  payload: status
})

export const setMessageDeleteModalStatus = (status) => ({
  type: SET_MESSAGE_DELETE_MODAL_STATUS,
  payload: status
})

export const setMessageEditModalStatus = (status) => ({
  type: SET_MESSAGE_EDIT_MODAL_STATUS,
  payload: status
})

export const setEmojiSelectModalStatus = (status) => ({
  type: SET_EMOJI_SELECT_MODAL_STATUS,
  payload: status
})

export const setTargetMessageUid = (uid) => ({
  type: SET_TARGET_MESSAGE_UID,
  payload: uid
})

export const setTargetMessageContent = (content) => ({
  type: SET_TARGET_MESSAGE_CONTENT,
  payload: content
})

const initialState = {
  isChatRoomModalOpen: false,
  isMessageDeleteModalOpen: false,
  isMessageEditModalOpen: false,
  isEmojiSelectModalOpen: false,
  targetMessageUid: '',
  targetMessageContent: '',
}

const modal = (state = initialState, action) => {
  switch (action.type) {
    case SET_CHAT_ROOM_MODAL_STATUS:{
      return {
        ...state,
        isChatRoomModalOpen: action.payload,
      }
    }

    case SET_MESSAGE_DELETE_MODAL_STATUS:{
      return {
        ...state,
        isMessageDeleteModalOpen: action.payload,
      }
    }

    case SET_MESSAGE_EDIT_MODAL_STATUS:{
      return {
        ...state,
        isMessageEditModalOpen: action.payload,
      }
    }

    case SET_EMOJI_SELECT_MODAL_STATUS:{
      return {
        ...state,
        isEmojiSelectModalOpen: action.payload,
      }
    }

    case SET_TARGET_MESSAGE_UID:{
      return {
        ...state,
        targetMessageUid: action.payload,
      }
    }

    case SET_TARGET_MESSAGE_CONTENT:{
      return {
        ...state,
        targetMessageContent: action.payload,
      }
    }

    default:
      return state;
  }
};

export default modal;