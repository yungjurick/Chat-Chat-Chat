import React, { useState, useEffect } from 'react';
import { db, firebaseApp } from '../../firebase'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from '../../reducers/loading';
import RoomModal from '../../components/RoomModal/RoomModal';
import styled from 'styled-components';

const ChatList = () => {
	const { push } = useHistory();
	const dispatch = useDispatch();
	const userProfile = useSelector(state => state.user.userProfile);

	const [rooms, setRooms] = useState([]);
	const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

	console.log(rooms);

	const fetchChatRooms = async () => {
		dispatch(setLoading(true));
		try {
			const querySnapshot = await db.collection('chatrooms').get();

			querySnapshot.forEach((doc) => {
				console.log(doc.data())
				const updatedRooms = [...rooms, doc.data()]
				setRooms(updatedRooms);
			});
		} catch (e) {
			console.log(e);
		}

		dispatch(setLoading(false));
	}

	useEffect(() => {
    firebaseApp.auth().onAuthStateChanged(user => {
      const uid = (firebaseApp.auth().currentUser || {}).uid;

			console.log(uid, userProfile)

      if (!uid || userProfile === null) {
				alert('Please login to access the Chatrooms.')
        push('/users/login');
      }
    });
  }, [userProfile, push]);

	useEffect(() => fetchChatRooms(), [])

	return (
		<Layout>
			<Container>
				<NavContainer>
					<NavTitle>Chat Rooms</NavTitle>
					<NavButton onClick={() => setIsRoomModalOpen(true)}>Create New Room</NavButton>
					<NavButton secondary>Logout</NavButton>
				</NavContainer>
				<List>

				</List>
			</Container>
			<RoomModal isOpened={isRoomModalOpen}/>
		</Layout>
	)
}

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

const NavContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	border-bottom: 1px solid #EEEEEE;
	padding-bottom: 25px;
`;

const NavTitle = styled.h1`
	color: #1d3557;
	margin: 0;
	margin-right: auto;
`;

const NavButton = styled.button`
	border: none;
	padding: 10px 14px;
	border-radius: 4px;
	background-color: ${props => props.secondary ? "#1d3557" : "#78C1FF"};
	color: white;
	font-weight: bold;
	outline: none;
	margin-left: 12px;
	cursor: pointer;
`;

const List = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	column-gap: 10px;
	height: 90%;
`;

const ListItem = styled.div``;

const ListItemTitle = styled.p``;

const ListItemDescription = styled.p``;

export default ChatList