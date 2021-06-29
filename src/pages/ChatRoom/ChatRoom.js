import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

const ChatRoom = () => {
  const { roomId } = useParams();

  return <div>Chat Room #{roomId}</div>
}

export default ChatRoom