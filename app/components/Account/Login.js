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
      <div className="login-container container">
        <div className="panel">
          <div className="panel-body">
            <Messages messages={this.props.messages} />
            <form onSubmit={this.handleLogin}>
              <legend>Log In</legend>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  autoFocus
                  className="form-control"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="form-control"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group"><Link to="/forgot"><strong>Forgot your password?</strong></Link></div>
              <button type="submit" className="btn btn-success">Log in</button>
            </form>
            <div className="hr-title"><span>or</span></div>
            <div className="btn-toolbar text-center">
              <button onClick={this.handleFacebook} className="btn btn-facebook">Sign in with Facebook</button>
              <button onClick={this.handleTwitter} className="btn btn-twitter">Sign in with Twitter</button>
            </div>
          </div>
        </div>
        <p className="text-center">
          Don't have an account? <Link to="/signup"><strong>Sign up</strong></Link>
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  messages: state.messages
});

export default connect(mapStateToProps)(Login);
