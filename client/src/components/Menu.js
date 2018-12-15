import React, { Component, Fragment } from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import {
  Nav,
  NavItem,
  NavLink,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import axios from 'axios';
import config from '../config';
import { AuthContext } from '../context/AuthContext';

const items = [
  { key: 'menuHome', path: '/', title: 'Home', protected: false },
  { key: 'menuUsers', path: '/users', title: 'Users', protected: true }
];

class Menu extends Component {
  static contextType = AuthContext;

  state = {
    modal: false,
    email: '',
    password: ''
  };

  handleLogin = async () => {
    try {
      const payload = {
        email: this.state.email,
        password: this.state.password
      };
      const url = config.API_URL + '/login';
      const response = await axios.post(url, payload, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const user = { email: this.state.email, token: response.data.token };
      this.context.setUser(user);
      this.setState({ modal: false });
    } catch (error) {
      this.setState({ modal: false });
      this.props.displayError(error);
    }
  };

  handleLogout = () => {
    this.context.setUser(null);
  };

  validateForm() {
    return (
      this.state.email.length > 2 &&
      this.state.email.includes('@') &&
      this.state.password.length > 0
    );
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
  };

  showModal = () => {
    this.setState({ modal: true });
  };

  hideModal = () => {
    this.setState({ modal: false });
  };

  render() {
    return (
      <Fragment>
        <Nav className="justify-content-center">
          {items.map(item => {
            return (
              (this.context.state.currentUser || !item.protected) && (
                <NavItem key={'ni_' + item.key}>
                  <NavLink key={item.key} tag={RRNavLink} to={item.path}>
                    {item.title}
                  </NavLink>
                </NavItem>
              )
            );
          })}
          {this.context.state.currentUser ? (
            <Button
              key="menuLogout"
              color="link"
              onClick={() => this.handleLogout()}
            >
              Log out
            </Button>
          ) : (
            <Button key="menuLogin" color="link" onClick={this.showModal}>
              Log in
            </Button>
          )}
        </Nav>
        {/* Modal containing login form */}
        <Modal isOpen={this.state.modal} toggle={this.hideModal}>
          <ModalHeader toggle={this.hideModal}>Log in</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  autoFocus
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              disabled={!this.validateForm()}
              onClick={() => this.handleLogin()}
            >
              Log in
            </Button>
            <Button color="secondary" onClick={this.hideModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

export default Menu;
