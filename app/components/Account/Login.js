import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import { facebookLogin, twitterLogin, googleLogin, vkLogin } from '../../actions/oauth';
import Messages from '../Messages';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: 'admin@admin.com', password: 'admin' };
    this.handleFacebook = this.handleFacebook.bind(this);
    this.handleTwitter = this.handleTwitter.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleLogin(event) {
    event.preventDefault();
    this.props.dispatch(login(this.state.email, this.state.password));
  }

  handleFacebook() {
    this.props.dispatch(facebookLogin());
  }

  handleTwitter() {
    this.props.dispatch(twitterLogin());
  }

  handleGoogle() {
    this.props.dispatch(googleLogin());
  }

  handleVk() {
    this.props.dispatch(vkLogin());
  }

  render() {
    return (
      <div className="column row">
        <div className="row">
          <div className="medium-8 medium-offset-2 columns">
            <Messages messages={this.props.messages} />

            <form onSubmit={this.handleLogin}>
              <h4>Log In</h4>

              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleChange}
                autoFocus
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.handleChange}
              />

              <p><Link to="/forgot">Forgot your password?</Link></p>

              <button type="submit" className="button">Log in</button>
            </form>

            <div className="hr-title"><span>or</span></div>

            <div className="button-group">
              <button
                onClick={this.handleFacebook}
                className="button facebook"
              >
                Sign in with Facebook
              </button>
              <button
                onClick={this.handleTwitter}
                className="button twitter"
              >
                Sign in with Twitter
              </button>
            </div>

            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  messages: state.messages
});

export default connect(mapStateToProps)(Login);
