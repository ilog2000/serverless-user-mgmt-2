import React, { Component, Fragment } from 'react';
import { Table, NavLink, Button } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { AuthContext } from '../context/AuthContext';

export class UserList extends Component {
  static contextType = AuthContext;

  state = { users: [] };

  async componentDidMount() {
    try {
      const token = this.context.state.currentUser.token;
      const url = config.API_URL + '/api/v1/users';
      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        useCredentials: true
      });
      this.setState({ users: response.data.Items });
    } catch (error) {
      this.setState({ users: [] });
      this.props.displayError(error);
    }
  }

  handleDelete = async (e, id) => {
    e.preventDefault();
    if (window.confirm('Are you sure?')) {
      try {
        const token = this.context.state.currentUser.token;
        const url = config.API_URL + '/api/v1/users/' + id;
        axios.delete(url, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          },
          useCredentials: true
        });
        window.location.reload();
      } catch (error) {
        this.props.displayError(error);
      }
    }
  };

  render() {
    return (
      <Fragment>
        <NavLink tag={RRNavLink} to={'/users/new'}>
          New user
        </NavLink>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Actions</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {this.state.users.map((user, index) => {
              return (
                <tr key={user.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>
                    <NavLink tag={RRNavLink} to={'/users/edit/' + user.id}>
                      Edit
                    </NavLink>
                  </td>
                  <td>
                    <NavLink
                      tag={RRNavLink}
                      to={'/changepassword/' + user.id}
                      disabled={
                        user.email !== this.context.state.currentUser.email
                      }
                    >
                      Change password
                    </NavLink>
                  </td>
                  <td>
                    <Button
                      color="link"
                      onClick={e => this.handleDelete(e, user.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Fragment>
    );
  }
}

export default UserList;
