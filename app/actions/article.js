import { browserHistory } from 'react-router';
import Connection from '../../config/connection';

export function saveArticle(title, postRaw, postRawHTML) {
  return (dispatch, getState) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });

    return Connection.post('/article', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        posts: postRawHTML,
        raw_posts: postRaw,
        user_id: getState().auth.user.id
      })
    })
    .then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          browserHistory.push('/');
          dispatch({
            type: 'CREATE_ARTICLE_SUCCESS',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'CREATE_ARTICLE_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function getAll() {
  return (dispatch) => {
    return Connection.get('/article').then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'FETCH_ARTICLE_SUCCESS',
            articles: json.articles
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'FETCH_ARTICLE_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}
