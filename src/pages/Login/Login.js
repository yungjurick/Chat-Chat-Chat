import React, { useState, useEffect } from 'react';
import { db, firebaseApp } from '../../firebase'
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserProfile } from '../../reducers/user';
import { setLoading } from '../../reducers/loading';

import {
	Layout,
	Container,
	Header,
	FormLabel,
	FormTextInput,
	FormButton,
	FormSubtitle
} from '../../styles/Form'

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [loginObject, setLoginObject] = useState({
    email: '',
    password: ''
  })

  const { email, password } = loginObject;

  const onChangeLoginObject = (e, type) => {
    setLoginObject({
				...loginObject,
				[type]: e.target.value
			})
		}

  const onSubmitLogin = async () => {
    // Start Loading
    dispatch(setLoading(true));

    try {
      await firebaseApp.auth().signInWithEmailAndPassword(email, password)
      const uid = (firebaseApp.auth().currentUser || {}).uid;

      if (uid) {
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        dispatch(setUserProfile(userDoc.data()));
        
        history.push('/chat/room');
      }
    } catch (e) {
      alert(e.message);
    }

    // End Loading
    dispatch(setLoading(false));
  }

	return (
		<Layout>
			<Container>
				<Header>Login to Chat App</Header>

				<FormLabel>Email</FormLabel>
				<FormTextInput type="text" value={email} onChange={e => onChangeLoginObject(e, 'email')}/>

				<FormLabel>Password</FormLabel>
				<FormTextInput type="password" value={password} onChange={e => onChangeLoginObject(e, 'password')}/>

				<FormButton onClick={onSubmitLogin}>
					Login
				</FormButton>

				<FormSubtitle>
					<Link to="/users/signup">New to Chat App?</Link>
				</FormSubtitle>

			</Container>
		</Layout>
	)
}

export default Login