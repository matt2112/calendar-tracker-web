import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import firebase from '../../firebaseConfig';

import './navBar.css';

class NavBar extends Component {
  state = {
    showSignOutButton: false
  };

  toggleButton = () => {
    this.setState(prevState => ({
      showSignOutButton: !prevState.showSignOutButton
    }));
  };

  render() {
    return (
      <div id="navBar">
        <div className="left">
          <NavLink exact className="link" to="/">
            Calendar
          </NavLink>
          <NavLink className="link" to="/table">
            Table
          </NavLink>
          <NavLink className="link" to="/options">
            Options
          </NavLink>
        </div>
        <div className="right">
          <div className="link" onClick={this.toggleButton} role="presentation">
            {firebase.auth().currentUser.displayName}
          </div>
          {this.state.showSignOutButton && (
            <NavLink
              exact
              className="link"
              id="signOut"
              to="/login"
              onClick={() => firebase.auth().signOut()}
            >
              Sign Out
            </NavLink>
          )}
        </div>
      </div>
    );
  }
}

export default NavBar;
