import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <AuthContext.Consumer>
    {auth => (
      <Route
        render={props =>
          auth.state.currentUser ? (
            <Component {...props} />
          ) : (
            <Redirect to="/" />
          )
        }
        {...rest}
      />
    )}
  </AuthContext.Consumer>
);

export default ProtectedRoute;
