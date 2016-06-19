import { browserHistory } from 'react-router';

export function saveArticle(title, postRaw, postRawHTML) {
  return (dispatch, getState) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });

    return fetch('/article', {
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
