import React from 'react';
import styled from 'styled-components';
import { MdClose } from "react-icons/md";

const EmojiSelectModal = ({ onClose, emojiList, onSelectEmoji, targetMessageUid }) => {
  
  const handleOnSelect = (emojiUid, messageUid) => {
    onSelectEmoji(emojiUid, messageUid);
    onClose();
  }

  return (
    <Layout>
      <Container>
        <Header>
          <p>Add Reaction</p>
          <MdClose size="1.4em" onClick={() => onClose()}/>
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

const Layout = styled.div`
  z-index: 100;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
`

const Container = styled.div`
  border-radius: 4px;
  box-shadow: rgba(99, 99, 99, 0.3) 0px 2px 8px 0px;
  background-color: white;
  width: 300px;
  padding: 12px 0;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  margin-bottom: 12px;
  p {
    margin: 0;
    background-color: #78C1FF;
    color: #1D3458;
    font-weight: bold;
    border-radius: 4px;
    padding: 4px 8px;
  }
  svg {
    cursor: pointer;
  }
`

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