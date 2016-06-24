export default function articles(state = {}, action) {
  switch (action.type) {
    case 'FETCH_ARTICLE_SUCCESS':
      return Object.assign({}, state, action.articles);
    default:
      return state;
  }
}
