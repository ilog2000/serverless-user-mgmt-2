import React, { Component, createContext } from 'react';

export const AuthContext = createContext();

export class AuthProvider extends Component {
  constructor() {
    super();

    const u = localStorage.getItem('currentUser');
    const user = u ? JSON.parse(u) : null;
    this.state = {
      currentUser: user
    };
  }

  setUser = user => {
    if (user) localStorage.setItem('currentUser', JSON.stringify(user));
    else localStorage.removeItem('currentUser');

    this.setState({ currentUser: user });
  };

  render() {
    return (
      <AuthContext.Provider
        value={{ state: this.state, setUser: this.setUser }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
