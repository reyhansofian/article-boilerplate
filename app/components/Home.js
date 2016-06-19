import React from 'react';
import { connect } from 'react-redux';
import Messages from './Messages';

const Home = ({ messages }) => {
  return (
    <div className="expanded row">
      <Messages messages={messages} />
      <div className="row">
        <div className="columns">
          <h3>Welcome</h3>
          <p>Welcome.</p>
          <a href="#" role="button" className="button">View details</a>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  messages: state.messages
});

export default connect(mapStateToProps)(Home);
