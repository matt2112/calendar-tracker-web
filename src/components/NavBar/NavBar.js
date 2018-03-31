import React from 'react';
import { NavLink } from 'react-router-dom';
import firebase from '../../firebaseConfig';

import './navBar.css';

const NavBar = () => (
  <div id="navBar">
    <div className="left">
      <NavLink className="link" to="/calendar">
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
      <NavLink exact className="link" to="/" onClick={() => firebase.auth().signOut()}>
        Sign-out
      </NavLink>
    </div>
  </div>
);

export default NavBar;
