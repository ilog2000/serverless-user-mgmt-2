import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './components/HomePage';
import UsersPage from './components/UsersPage';
import ChangePasswordPage from './components/ChangePasswordPage';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <AuthProvider>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <ProtectedRoute exact path="/users" component={UsersPage} />
            <ProtectedRoute exact path="/users/new" component={UsersPage} />
            <ProtectedRoute path="/users/edit/:userID" component={UsersPage} />
            <ProtectedRoute path="/changepassword/:userID" component={ChangePasswordPage} />
            <Route component={NotFound} />
          </Switch>
        </AuthProvider>
      </BrowserRouter>
    );
  }
}

export default App;
