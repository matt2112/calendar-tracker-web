import React from "react";

import "./login.css";

const Login = props => (
  <div id="login">
    <form onSubmit={props.onLogin}>
      {props.signingUp && <h1 className="sub-header">Sign Up</h1>}
      {!props.signingUp && <h1 className="sub-header">Log In</h1>}
      <label htmlFor="email">E-Mail</label>
      <input name="email" type="text" placeholder="email" />
      <label htmlFor="password">Password</label>
      <input name="password" type="password" placeholder="password" />
      <button type="submit">Submit</button>
    </form>
    {props.signingUp && (
      <button onClick={props.onSwitchLoginType}>Log In</button>
    )}
    {!props.signingUp && (
      <button onClick={props.onSwitchLoginType}>Sign Up</button>
    )}
  </div>
);

export default Login;
