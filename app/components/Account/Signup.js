import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { signup } from '../../actions/auth';
import { facebookLogin, twitterLogin, googleLogin, vkLogin } from '../../actions/oauth';
import Messages from '../Messages';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', email: '', password: '' };
    this.handleSignup = this.handleSignup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFacebook = this.handleFacebook.bind(this);
    this.handleTwitter = this.handleTwitter.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSignup(event) {
    event.preventDefault();
    this.props.dispatch(signup(this.state.name, this.state.email, this.state.password));
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

            <form onSubmit={this.handleSignup}>
              <h4>Create an account</h4>

              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                value={this.state.name}
                onChange={this.handleChange}
                autoFocus
              />

              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleChange}
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

              <p className="help-text">
                By signing up, you agree to the <Link to="/">Terms of Service</Link>.
              </p>

              <button type="submit" className="button">Create an account</button>
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

            <p>Already have an account? <Link to="/login">Log in</Link></p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  messages: state.messages
});

export default connect(mapStateToProps)(Signup);
