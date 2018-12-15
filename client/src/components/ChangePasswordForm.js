import React, { Component } from 'react';
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { AuthContext } from '../context/AuthContext';

class ChangePasswordForm extends Component {
  static contextType = AuthContext;

  state = {
    oldpassword: '',
    newpassword: '',
    repeatpassword: '',
    toUserList: false
  };

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
  };

  handleSave = async () => {
    try {
      const userID = this.props.match.params.userID;
      const token = this.context.state.currentUser.token;
      const payload = {
        id: userID,
        oldpassword: this.state.oldpassword,
        newpassword: this.state.newpassword
      };
      const url = config.API_URL + '/changepassword';
      await axios.post(url, payload, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        useCredentials: true
      });
      this.setState({ toUserList: true });
    } catch (error) {
      this.props.displayError(error);
    }
  };

  validateForm() {
    return (
      this.state.oldpassword.length > 0 &&
      this.state.newpassword.length > 0 &&
      this.state.repeatpassword === this.state.newpassword
    );
  }

  render() {
    if (this.state.toUserList) {
      return <Redirect to="/users" />;
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup row>
          <Label for="oldpassword" sm={2}>
            Old Password
          </Label>
          <Col sm={10}>
            <Input
              type="password"
              name="oldpassword"
              id="oldpassword"
              value={this.state.oldpassword}
              onChange={this.handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="newpassword" sm={2}>
            New Password
          </Label>
          <Col sm={10}>
            <Input
              type="password"
              name="newpassword"
              id="newpassword"
              value={this.state.newpassword}
              onChange={this.handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="repeatpassword" sm={2}>
            Repeat Password
          </Label>
          <Col sm={10}>
            <Input
              type="password"
              name="repeatpassword"
              id="repeatpassword"
              value={this.state.repeatpassword}
              onChange={this.handleChange}
            />
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

export default ChangePasswordForm;
