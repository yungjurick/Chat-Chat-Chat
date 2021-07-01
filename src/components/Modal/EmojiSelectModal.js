import React from 'react';
import styled from 'styled-components';
import { MdClose } from "react-icons/md";
import {
  Layout,
  Container,
  Header
} from '../../styles/Modal';
import {
  setEmojiSelectModalStatus,
  setTargetMessageUid
} from '../../reducers/modal'
import { useDispatch } from 'react-redux';

const EmojiSelectModal = ({ emojiList, onSelectEmoji, targetMessageUid }) => {
  const dispatch = useDispatch();

  const handleOnClose = () => {
    dispatch(setEmojiSelectModalStatus(false));
    dispatch(setTargetMessageUid(''));
  }

  // Emoji Select Box Logic
  const handleOnSelect = (emojiUid, messageUid) => {
    onSelectEmoji(emojiUid, messageUid);
    handleOnClose();
  }

  return (
    <Layout>
      <Container>
        <Header>
          <p>Add Reaction</p>
          <MdClose size="1.4em" onClick={() => handleOnClose()}/>
        </Header>
        <EmojiGrid>
          {
            emojiList.map(emoji => {
              return (
                <EmojiGridItem
                  key={emoji.uid}
                  onClick={() => handleOnSelect(emoji.uid, targetMessageUid)}
                >
                  <EmojiImage src={emoji.imageUrl}/>
                </EmojiGridItem>
              )
            })
          }
        </EmojiGrid>
      </Container>
    </Layout>
  )
}

const EmojiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  column-gap: 10px;
  row-gap: 10px;
  grid-template-rows: 50px;
  padding: 0 12px;
`

const EmojiGridItem = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  transition: all 0.2s cubic-bezier(.25,.8,.25,1);
  cursor: pointer;
  &:hover {
    background-color: rgba(150, 50, 0, 0.3);
  }
`

const EmojiImage = styled.img`
  width: 30px;
  height: 30px;
`

export default EmojiSelectModal