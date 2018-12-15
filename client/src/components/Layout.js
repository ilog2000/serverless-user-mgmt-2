import React, { Component, Fragment } from 'react';
import { Alert } from 'reactstrap';
import Menu from './Menu';

class Layout extends Component {
  state = {
    error: null
  };

  displayError = error => {
    const message = error.response
      ? error.response.data.message
      : error.message;
    this.setState({ error: { message } });
  };

  dismissError = () => {
    this.setState({ error: null });
  };

  render() {
    const { children } = this.props;

    // IMPORTANT: we cannot inject our additional props to ReactElements,
    // as their props are validated against HTML attributes.
    // Thus, all children of Layout must be ReactComponent (at least Fragment).
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { displayError: this.displayError })
    );

    const alertStyle = {
      position: 'fixed',
      bottom: '0',
      right: '0',
      zIndex: '999'
    };

    return (
      <Fragment>
        {/* Alert to display error */}
        {this.state.error && (
          <Alert
            color="danger"
            style={alertStyle}
            isOpen={this.state.error ? true : false}
            toggle={this.dismissError}
          >
            {this.state.error.message}
          </Alert>
        )}
        {/* Menu */}
        <Menu displayError={this.displayError} />
        <hr />
        {/* Modified this.props.children */}
        <div className="container">{childrenWithProps}</div>
      </Fragment>
    );
  }
}

export default Layout;
