import styled from 'styled-components';

const Layout = styled.div`
  z-index: 70;
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
    background-color: ${props => {
      if (props.type === 'negative') {
        return '#E84855'
      } else if (props.type === 'positive') {
        return '#63C132'
      } else {
        return '#78C1FF'
      }
    }};
    color: ${props => props.type === 'negative' ? 'white' : '#1D3458'};
    font-weight: bold;
    border-radius: 4px;
    padding: 4px 8px;
  }
  svg {
    cursor: pointer;
  }
`

const RoomModalLayout = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 90;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
`

const RoomModalContainer = styled.div`
  width: 400px;
  height: auto;
  background-color: white;
  border-radius: 4px;
  box-shadow: rgba(99, 99, 99, 0.3) 0px 2px 8px 0px;
  padding: 24px 32px;
`

const MessageModalContainer = styled(Container)`
  width: 30%;
`
const Content = styled.div`
  padding: 0 12px;
`

const Text = styled.p`
  font-weight: 600;
  margin: 0;
`

const ButtonContainer = styled.div`
  padding: 0 12px;
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
`
const Button = styled.button`
  border-radius: 4px;
  padding: 10px 14px;
  border: none;
  outline: none;
  font-weight: 600;
  cursor: pointer;
  background-color: ${props => {
    if (props.type === 'negative') {
      return '#E84855'
    } else if (props.type === 'positive') {
      return '#63C132'
    } else {
      return '#78C1FF'
    }
  }};
  color: ${props => props.type === 'negative' ? 'white' : '#1D3458'};
  & + & {
    margin-left: 12px;
  }
`
const Textarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  font-weight: 600;
  margin: 0;
  box-sizing: border-box;
  resize: none;
  overflow: auto;
  outline: none;
  font-family: Arial, Helvetica, sans-serif;
  padding: 12px;
`

export {
  Layout,
  RoomModalLayout,
  Container,
  RoomModalContainer,
  MessageModalContainer,
  Header,
  Content,
  Text,
  ButtonContainer,
  Button,
  Textarea
}