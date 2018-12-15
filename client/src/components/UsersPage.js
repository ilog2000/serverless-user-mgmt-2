import React from 'react';
import Layout from './Layout';
import UserList from './UserList';
import UserForm from './UserForm';

const UsersPage = (props) => {
  const url = props.match.url;
  const userID = props.match.params.userID;

  let component = null;
  if (userID || url === '/users/new') {
    component = <UserForm userID={userID} {...props} />;
  } else {
    component = <UserList />;
  }

  return <Layout>{component}</Layout>;
}

export default UsersPage

