import url from 'url';
import qs from 'querystring';
import moment from 'moment';
import cookie from 'react-cookie';
import { browserHistory } from 'react-router';

function oauth2(config, dispatch) {
  return new Promise((resolve) => {
    const params = {
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scope,
      display: 'popup',
      response_type: 'code'
    };
    const url = config.authorizationUrl + '?' + qs.stringify(params); // eslint-disable-line
    resolve({ url, config, dispatch });
  });
}

function closePopup({ window, interval }) {
  return new Promise((resolve) => {
    clearInterval(interval);
    window.close();
    resolve();
  });
}

function pollPopup({ window, config, requestToken, dispatch }) {
  return new Promise((resolve) => {
    const redirectUri = url.parse(config.redirectUri);
    const redirectUriPath = redirectUri.host + redirectUri.pathname;

    if (requestToken) {
      window.location = `${config.authorizationUrl}?${qs.stringify(requestToken)}`;
    }

    const polling = setInterval(() => {
      if (!window || window.closed) {
        clearInterval(polling);
      }
      try {
        const popupUrlPath = window.location.host + window.location.pathname;
        if (popupUrlPath === redirectUriPath) {
          if (window.location.search || window.location.hash) {
            const query = qs.parse(window.location.search.substring(1).replace(/\/$/, ''));
            const hash = qs.parse(window.location.hash.substring(1).replace(/[\/$]/, ''));
            const params = Object.assign({}, query, hash);

            if (params.error) {
              dispatch({
                type: 'OAUTH_FAILURE',
                messages: [{ msg: params.error }]
              });
            } else {
              resolve({
                oauthData: params,
                config,
                window,
                interval: polling,
                dispatch
              });
            }
          } else {
            dispatch({
              type: 'OAUTH_FAILURE',
              messages: [{
                msg: 'OAuth redirect has occurred but no query or hash parameters were found.'
              }]
            });
          }
        }
      } catch (error) {
        // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
        // A hack to get around same-origin security policy errors in Internet Explorer.
      }
    }, 500);
  });
}

function exchangeCodeForToken({ oauthData, config, window, interval, dispatch }) {
  return new Promise((resolve) => {
    const data = Object.assign({}, oauthData, config);

    return fetch(config.url, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          resolve({
            token: json.token,
            user: json.user,
            window,
            interval,
            dispatch
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'OAUTH_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
          closePopup({ window, interval });
        });
      }
    });
  });
}

function signIn({ token, user, window, interval, dispatch }) {
  return new Promise((resolve) => {
    dispatch({
      type: 'OAUTH_SUCCESS',
      token,
      user
    });
    cookie.save('token', token, { expires: moment().add(1, 'hour').toDate() });
    browserHistory.push('/');
    resolve({ window, interval });
  });
}

function openPopup({ url, config, dispatch }) { // eslint-disable-line
  return new Promise((resolve) => {
    const width = config.width || 500;
    const height = config.height || 500;
    const options = {
      width,
      height,
      top: window.screenY + ((window.outerHeight - height) / 2.5),
      left: window.screenX + ((window.outerWidth - width) / 2)
    };
    const popup = window.open(url, '_blank', qs.stringify(options, ','));

    if (url === 'about:blank') {
      popup.document.body.innerHTML = 'Loading...';
    }

    resolve({ window: popup, config, dispatch });
  });
}


function oauth1(config, dispatch) {
  return new Promise((resolve) => {
    resolve({ url: 'about:blank', config, dispatch });
  });
}

function getRequestToken({ window, config, dispatch }) {
  return new Promise((resolve) => {
    return fetch(config.url, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        redirectUri: config.redirectUri
      })
    }).then((response) => { // eslint-disable-line
      if (response.ok) {
        return response.json().then((json) => {
          resolve({ window, config, requestToken: json, dispatch });
        });
      }
    });
  });
}

// Sign in with Facebook
export function facebookLogin() {
  const facebook = {
    url: 'http://localhost:3000/auth/facebook',
    clientId: '980220002068787',
    redirectUri: 'http://localhost:3000/auth/facebook/callback',
    authorizationUrl: 'https://www.facebook.com/v2.5/dialog/oauth',
    scope: 'email,user_location',
    width: 580,
    height: 400
  };

  return (dispatch) => {
    oauth2(facebook, dispatch)
      .then(openPopup)
      .then(pollPopup)
      .then(exchangeCodeForToken)
      .then(signIn)
      .then(closePopup);
  };
}

// Sign in with Twitter
export function twitterLogin() {
  const twitter = {
    url: 'http://localhost:3000/auth/twitter',
    redirectUri: 'http://localhost:3000/auth/twitter/callback',
    authorizationUrl: 'https://api.twitter.com/oauth/authenticate'
  };

  return (dispatch) => {
    oauth1(twitter, dispatch)
      .then(openPopup)
      .then(getRequestToken)
      .then(pollPopup)
      .then(exchangeCodeForToken)
      .then(signIn)
      .then(closePopup);
  };
}

// Link account
export function link(provider) {
  switch (provider) {
    case 'facebook':
      return facebookLogin();
    case 'twitter':
      return twitterLogin();
    default:
      return {
        type: 'LINK_FAILURE',
        messages: [{ msg: 'Invalid OAuth Provider' }]
      };
  }
}

// Unlink account
export function unlink(provider) {
  return (dispatch) => {
    return fetch(`/unlink/${provider}`).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'UNLINK_SUCCESS',
            messages: [json]
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'UNLINK_FAILURE',
            messages: [json]
          });
        });
      }
    });
  };
}
