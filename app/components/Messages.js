import React from 'react';

class Messages extends React.Component {
  render() {
    return this.renderMessage();
  }

  renderMessage() {
    if (this.props.messages.success) {
      return (
        <div role="alert" className="callout success">
          {this.props.messages.success.map((message, index) =>
            <div key={index}>{message.msg}</div>)
          }
        </div>
      );
    } else if (this.props.messages.error) {
      return (
        <div role="alert" className="callout alert">
          {this.props.messages.error.map((message, index) => <div key={index}>{message.msg}</div>)}
        </div>
      );
    } else if (this.props.messages.info) {
      return (
        <div role="alert" className="callout primary">
          {this.props.messages.info.map((message, index) => <div key={index}>{message.msg}</div>)}
        </div>
      );
    }

    return null;
  }
}

export default Messages;
