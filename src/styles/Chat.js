import styled from 'styled-components';

const Layout = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #78C1FF;
`;

const Container = styled.div`
	width: 90%;
	height: 90%;
	box-shadow: rgba(99, 99, 99, 0.3) 0px 2px 8px 0px;
	background-color: white;
	border-radius: 4px;
	padding: 25px;
`;

export {
  Layout,
  Container
}