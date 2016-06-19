import React from 'react';
import { connect } from 'react-redux';
import { forgotPassword } from '../../actions/auth';
import Messages from '../Messages';

class Forgot extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '' };
    this.handleForgot = this.handleForgot.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleForgot(event) {
    event.preventDefault();
    this.props.dispatch(forgotPassword(this.state.email));
  }

  render() {
    return (
      <div className="column row">
        <div className="medium-8 medium-offset-2 columns">
          <Messages messages={this.props.messages} />
          <form onSubmit={this.handleForgot}>
            <h4>Forgot Password</h4>

            <p>Enter your email address below and we'll send you password reset instructions.</p>

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

            <button type="submit" className="button success">Reset Password</button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages
  };
};

export default connect(mapStateToProps)(Forgot);
