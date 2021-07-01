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

export {
  Layout,
  Container,
  Header
}