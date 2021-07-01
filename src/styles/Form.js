import styled from 'styled-components';

const Layout = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #78C1FF;
`

const Container = styled.div`
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  box-shadow: rgba(99, 99, 99, 0.3) 0px 2px 8px 0px;
  padding: 24px 32px;
  border-radius: 4px;
`

const Header = styled.h1`
  font-size: 24px;
  margin: 0 0 32px 0;
`

const FormLabel = styled.p`
  max-width: 60%;
  line-height: 1.5;
  align-self: ${props => props.row ? "center" : "flex-start"};
  font-size: ${props => props.row ? "10px" : "12px"};
  margin: 0;
  
`

const FormTextInput = styled.input`
  width: 100%;
  margin: 8px 0 12px 0;
  outline: none;
  padding: 4px 6px;
  box-sizing: border-box;
`

const FormCheckbox = styled(FormTextInput)`
  width: auto;
  margin: 0;
`

const FormRowContainer = styled.div`
  margin-top: 14px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const FormSelect = styled.select`
  font-size: 12px;
`

const FormButton = styled.button`
  justify-self: flex-end;
  width: 100%;
  background-color: ${props => props.secondary ? "#1d3557" : "#78C1FF;"};
  border: none;
  color: white;
  font-weight: bold;
  padding: 12px 6px;
  font-size: 16px;
  border-radius: 4px;
  margin-top: 26px;
  cursor: pointer;
  & + & {
    margin-top: 12px;
  }
`

const FormSubtitle = styled.p`
  align-self: center;
  font-size: 10px;
  color: #78C1FF;
  margin-top: 12px;
  font-weight: bold;
  cursor: pointer;
  a {
    color: #78C1FF;
    text-decoration: none;
  }
`

export {
  Layout,
  Container,
  Header,
  FormLabel,
  FormTextInput,
  FormCheckbox,
  FormRowContainer,
  FormSelect,
  FormButton,
  FormSubtitle
}