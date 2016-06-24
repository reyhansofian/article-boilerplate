import { combineReducers } from 'redux';
import messages from './messages';
import auth from './auth';
import articles from './articles';

export default combineReducers({
  messages,
  auth,
  articles
});
