import React, { Component } from 'react';
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { AuthContext } from '../context/AuthContext';

const emptyUser = {
  id: '',
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  role: 'none',
  picture: 'unknown.png',
  active: false
};

export class UserForm extends Component {
  static contextType = AuthContext;

  state = { user: emptyUser, toUserList: false };

  async componentDidMount() {
    const userID = this.props.match.params.userID;
    if (userID) {
      try {
        const token = this.context.state.currentUser.token;
        const url = config.API_URL + '/api/v1/users/' + userID;
        const response = await axios.get(url, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          },
          useCredentials: true
        });
        this.setState({ user: response.data.Item });
      } catch (error) {
        this.setState({ user: emptyUser });
        this.props.displayError(error);
      }
    } else {
      this.setState({ user: emptyUser });
    }
  }

  handleChange = e => {
    const user = { ...this.state.user };
    user[e.target.id] =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    this.setState({ user });
  };

  handleSubmit = e => {
    e.preventDefault();
  };

  handleSave = async () => {
    try {
      const token = this.context.state.currentUser.token;
      const userID = this.state.user.id;
      if (userID) {
        // update
        const payload = { ...this.state.user };
        delete payload['password'];
        const url = config.API_URL + '/api/v1/users/' + userID;
        await axios.put(url, payload, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          },
          useCredentials: true
        });
        this.setState({ toUserList: true });
      } else {
        // create
        const url = config.API_URL + '/api/v1/users';
        await axios.post(url, this.state.user, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          },
          useCredentials: true
        });
        this.setState({ toUserList: true });
      }
    } catch (error) {
      this.props.displayError(error);
    }
  };

  validateForm() {
    return (
      this.state.user.email.length > 0 &&
      this.state.user.first_name.length > 0 &&
      this.state.user.last_name.length > 0 &&
      this.state.user.role.length > 0
    );
  }

  render() {
    if (this.state.toUserList) {
      return <Redirect to="/users" />;
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup row>
          <Label for="id" sm={2}>
            ID
          </Label>
          <Col sm={10}>
            <Input
              type="text"
              name="id"
              id="id"
              readOnly
              value={this.state.user.id}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="email" sm={2}>
            Email
          </Label>
          <Col sm={10}>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              readOnly={this.state.user.id ? true : false}
              value={this.state.user.email}
              onChange={this.handleChange}
            />
          </Col>
        </FormGroup>
        {this.state.user.id ? null : (
          <FormGroup row>
            <Label for="password" sm={2}>
              Password
            </Label>
            <Col sm={10}>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={this.state.user.password}
                onChange={this.handleChange}
              />
            </Col>
          </FormGroup>
        )}
        <FormGroup row>
          <Label for="first_name" sm={2}>
            First Name
          </Label>
          <Col sm={10}>
            <Input
              type="text"
              name="first_name"
              id="first_name"
              placeholder="First Name"
              readOnly={this.state.user.id ? true : false}
              value={this.state.user.first_name}
              onChange={this.handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="last_name" sm={2}>
            Last Name
          </Label>
          <Col sm={10}>
            <Input
              type="text"
              name="last_name"
              id="last_name"
              placeholder="Last Name"
              readOnly={this.state.user.id ? true : false}
              value={this.state.user.last_name}
              onChange={this.handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="role" sm={2}>
            Role
          </Label>
          <Col sm={10}>
            <Input
              type="select"
              name="role"
              id="role"
              value={this.state.user.role}
              onChange={this.handleChange}
            >
              <option>none</option>
              <option>admin</option>
              <option>developer</option>
              <option>editor</option>
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="active" sm={2}>
            {' '}
          </Label>
          <Col sm={{ size: 10 }}>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  id="active"
                  checked={this.state.user.active}
                  onChange={this.handleChange}
                />{' '}
                Active
              </Label>
            </FormGroup>
          </Col>
        </FormGroup>
        <FormGroup check row>
          <Col sm={{ size: 10, offset: 2 }}>
            <Button
              color="primary"
              disabled={!this.validateForm()}
              onClick={() => this.handleSave()}
            >
              Save
            </Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

export default UserForm;
