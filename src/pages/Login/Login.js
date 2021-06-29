import React, { useState, useEffect } from 'react';
import {db, firebaseApp} from '../../firebase'
import { useHistory } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  const onEmailChange = e => setEmail(e.target.value);
  const onPasswordChange = e => setPassword(e.target.value);

  const onSubmitLogin = async () => {
    try {
      await firebaseApp.auth().signInWithEmailAndPassword(email, password)
      const uid = (firebaseApp.auth().currentUser || {}).uid;

      if (uid) {
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();
        //then, set redux 
        
        history.push('/room/list');
      } else {
        alert('Error');
      }
    } catch (e) {
      const { code, message } = e;
    }
  }

	return <div>Login Page</div>
}

export default Login