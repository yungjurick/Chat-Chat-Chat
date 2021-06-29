import reducers from '../reducers';
import { applyMiddleware, createStore} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

export default createStore(
  reducers,
  {},
  composeWithDevTools(),
);