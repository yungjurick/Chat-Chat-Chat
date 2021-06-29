import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import ChatList from './pages/ChatList/ChatList';
import ChatRoom from './pages/ChatRoom/ChatRoom';

class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Landing}/>
          <Route exact path="/users/login" component={Login}/>
          <Route exact path="/users/signup" component={Signup}/>
          <Route exact path="/chat/room" component={ChatList}/>
          <Route exact path="/chat/room/:roomId" component={ChatRoom}/>
        </Switch>
      </Router>
    )
  }
}
export default Routes;