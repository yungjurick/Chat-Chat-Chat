import React, { useState, useEffect } from 'react';
import { db, firebaseApp } from '../../firebase'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { userLogOut} from '../../reducers/index';
import { resetCurrentChat, setRooms } from '../../reducers/chat';
import {
	Layout,
	Container
} from '../../styles/Chat';
import '../../styles/transitions.css';
import {
	setChatRoomModalStatus,
	setChatRoomPasswordModalStatus
} from '../../reducers/modal';
import RoomModal from '../../components/Modal/RoomModal';
import RoomPasswordModal from '../../components/Modal/RoomPasswordModal';
import styled from 'styled-components';

const ChatList = () => {
	const { push } = useHistory();
	const dispatch = useDispatch();

	const [newRoom, setNewRoom] = useState(null);
	const [removeRoom, setRemoveRoom] = useState(null);

	const [selectedRoom, setSelectedRoom] = useState({
		roomId: '',
		roomPw: ''
	})

	const userProfile = useSelector(state => state.user.userProfile);
	const rooms = useSelector(state => state.chat.roomList);
	const isChatRoomModalOpen = useSelector(state => state.modal.isChatRoomModalOpen);
	const isChatRoomPasswordModalOpen = useSelector(state => state.modal.isChatRoomPasswordModalOpen);

	console.log(rooms);

	// Subscriptions on Firestore
	useEffect(() => {
		// Reset Redux State for Chat
		dispatch(resetCurrentChat());

		const roomRef = db
			.collection('chatrooms')
			.orderBy("created")

		const unsubscribeRoom = roomRef.onSnapshot((snapshot) => {
			snapshot.docChanges().forEach((change) => {
				if (change.type === "added") {
					const newRoom = change.doc.data();
					setNewRoom(newRoom);
				}
				if (change.type === "removed") {
					console.log("remove room: ", change.doc.data());
					const removeRoom = change.doc.data();
          setRemoveRoom(removeRoom);
				}
			});
		});

		return () => {
			unsubscribeRoom();
		}

	}, [])

	useEffect(() => {
    if (newRoom) {
			console.log("New Chat Room:", newRoom, rooms)

			// Check if room is already in the rooms list
      const alreadyInList = rooms.findIndex(r => r.id === newRoom.id) >= 0;

			console.log(alreadyInList)

			if (!alreadyInList) {
				const newRooms = [...rooms]
				newRooms.push(newRoom)
				dispatch(setRooms(newRooms))
			}
    } 
  }, [newRoom])

  useEffect(() => {
    if (removeRoom) {
      console.log("Remove Room:", removeRoom)
      const newRooms = [...rooms].filter(r => r.id !== `${removeRoom.id}`);
      dispatch(setRooms(newRooms))
    } 
  }, [removeRoom])


	const onClickRoom = (password, roomId) => {
		console.log("Clicked Room: ", roomId, password);
		if (password.length > 0) {
			setSelectedRoom({
				roomId,
				password
			})
			dispatch(setChatRoomPasswordModalStatus(true));
		} else {
			// Navigate to Room
			push(`/chat/room/${roomId}`);
		}
	}

	const onLogout = async() => {
		push('/users/login');
		firebaseApp.auth().signOut()
		dispatch(userLogOut());
	}

	useEffect(() => {
    firebaseApp.auth().onAuthStateChanged(user => {
      const authUserUid = (firebaseApp.auth().currentUser || {}).uid;
			const userUid = (userProfile?.uid || null);

      if (!authUserUid || !userUid) {
				alert('Please login to access the Chatrooms.')
        push('/users/login');
      }
    });
  }, [userProfile.uid]);

	return (
		<Layout>
			<ChatListContainer>
				<NavContainer>
					<NavTitle>
						Live Chat Rooms
					</NavTitle>
					<NavButton onClick={() => dispatch(setChatRoomModalStatus(true))}>Create New Room</NavButton>
					<NavButton secondary onClick={() => onLogout()}>Logout</NavButton>
				</NavContainer>
				<TransitionGroup>
					<List>
					{
						rooms.map(({ title, description, id, password }) => {
							return (
								<CSSTransition
									key={id}
									timeout={1000}
									classNames="item"
								>
									<ListItem onClick={() => onClickRoom(password, id)}>
										<ListItemTitle>{title}</ListItemTitle>
										<ListItemDescription>{description}</ListItemDescription>
										<ListItemActionContainer>
											{
												password.length > 0 ? (<p>Private</p>) : (<p>Public</p>)
											}
										</ListItemActionContainer>
									</ListItem>
								</CSSTransition>
							)
						})
					}
					</List>
				</TransitionGroup>
			</ChatListContainer>
			{
				isChatRoomModalOpen && <RoomModal />
			}
			{
				isChatRoomPasswordModalOpen && <RoomPasswordModal roomId={selectedRoom.roomId} roomPw={selectedRoom.password} />
			}
		</Layout>
	)
}

const ChatListContainer = styled(Container)`
	display: grid;
	grid-template-rows: 10% 90%;
`

const NavContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	border-bottom: 1px solid #EEEEEE;
	padding-bottom: 25px;
	margin-bottom: 16px;
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
	grid-auto-rows: 150px;
	column-gap: 20px;
	row-gap: 20px;
	max-height: 100%;
  min-height: 0;
  overflow: scroll;
	&::-webkit-scrollbar {
    display: none;
  }
`;

const ListItem = styled.div`
	width: 100%;
	height: 100%;
	border-radius: 4px;
	background-color: #78C1FF;
	color: #1d3557;
	cursor: pointer;
	transition: all 0.3s cubic-bezier(.25,.8,.25,1);
	display: flex;
	flex-direction: column;
	box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
	&:hover {
		background-color: #1D3556;
		color: white;
		box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
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