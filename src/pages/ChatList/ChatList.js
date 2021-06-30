import React, { useState, useEffect } from 'react';
import { db, firebaseApp } from '../../firebase'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from '../../reducers/loading';
import RoomModal from '../../components/Modal/RoomModal';
import {
	Layout,
	Container
} from '../../styles/Chat';
import styled from 'styled-components';

const ChatList = () => {
	const { push } = useHistory();
	const dispatch = useDispatch();
	const userProfile = useSelector(state => state.user.userProfile);

	const [rooms, setRooms] = useState([]);
	const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

	console.log(rooms);

	const onCloseRoomModal = () => setIsRoomModalOpen(prev => !prev);

	const fetchChatRooms = async () => {
		dispatch(setLoading(true));
		try {
			const querySnapshot = await db.collection('chatrooms').get();
			const updatedRooms = []
			querySnapshot.forEach((doc) => {
				console.log(doc.data())
				updatedRooms.push(doc.data());
			});

			setRooms(updatedRooms);
		} catch (e) {
			console.log(e);
		}

		dispatch(setLoading(false));
	}

	// const navigateToRoom = async (roomId) => {


	const onClickRoom = (password, roomId) => {
		if (password.length > 0) {
			// PROMPT PASSWORD MODAL
		} else {
			// Navigate to Room
			push(`/chat/room/${roomId}`);
		}
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
					<NavTitle>
						Chat Rooms
					</NavTitle>
					<NavButton onClick={() => setIsRoomModalOpen(true)}>Create New Room</NavButton>
					<NavButton secondary>Logout</NavButton>
				</NavContainer>
				<List>
					{rooms.map(({ title, description, id, password }) => {
						return (
							<ListItem key={id} onClick={() => onClickRoom(password, id)}>
								<ListItemTitle>{title}</ListItemTitle>
								<ListItemDescription>{description}</ListItemDescription>
								<ListItemActionContainer>
									{
										password.length > 0 ? (<p>Private</p>) : (<p>Public</p>)
									}
								</ListItemActionContainer>
							</ListItem>
						)
					})}
				</List>
			</Container>
			<RoomModal isOpened={isRoomModalOpen} onClose={onCloseRoomModal}/>
		</Layout>
	)
}

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
	padding: 12px 0;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-auto-rows: 150px;
	column-gap: 10px;
	row-gap: 10px;
	height: 90%;
`;

const ListItem = styled.div`
	width: 100%;
	height: 100%;
	border-radius: 4px;
	background-color: #78C1FF;
	color: #1d3557;
	cursor: pointer;
	transition: all 0.2s;
	display: flex;
	flex-direction: column;
	&:hover {
		background-color: #1D3556;
		color: white;
	}
`;

const ListItemTitle = styled.p`
	padding: 0 12px;
	font-weight: bold;
	font-size: 12px;
`;

const ListItemDescription = styled.p`
	padding: 0 12px;
	font-size: 12px;
	margin: 0;
`;

const ListItemActionContainer = styled.div`
	margin-top: auto;
	height: 35px;
	width: 100%;
	border-top: 1px solid white;
	border-radius: 0 0 4px 4px;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	padding: 0 12px;
	box-sizing: border-box;
	p {
		font-weight: bold;
		font-size: 12px;
	}
`


export default ChatList