import React from 'react';
import { IndexLink, Link } from 'react-router';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(event) {
    event.preventDefault();
    this.props.dispatch(logout());
  }

  render() {
    const rightNav = this.props.token ? (
      <div className="top-bar-right">
        <ul className="menu">
          <li><Link to="/account" activeClassName="active">My Account</Link></li>
          <li><a href="#" onClick={this.handleLogout}>Logout</a></li>
        </ul>
      </div>
    ) : (
      <div className="top-bar-right">
        <ul className="menu">
          <li><Link to="/login" activeClassName="active">Log in</Link></li>
          <li><Link to="/signup" activeClassName="active">Sign up</Link></li>
        </ul>
      </div>
    );

    return (
      <div className="top-bar">
        <div className="top-bar-title">
          <span data-responsive-toggle="responsive-menu" data-hide-for="medium">
            <span className="menu-icon light" data-toggle></span>
          </span>
          <IndexLink to="/">Articles</IndexLink>
        </div>
        <div id="responsive-menu">
          <div className="top-bar-left">
            <ul className="menu">
              <li><IndexLink to="/" activeClassName="active">Home</IndexLink></li>
              {this.props.token &&
                <li>
                  <IndexLink
                    to="/article"
                    activeClassName="active"
                  >
                    Create Article
                  </IndexLink>
                </li>
              }
              {/* <li><Link to="/contact" activeClassName="active">Contact</Link></li> */}
            </ul>
          </div>
          {rightNav}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
  user: state.auth.user,
});

export default connect(mapStateToProps)(Header);
