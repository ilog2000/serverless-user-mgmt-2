import React from 'react';
import Layout from './Layout';
import ChangePasswordForm from './ChangePasswordForm';

const ChangePassword = (props) => {
  return (
    <Layout>
      <ChangePasswordForm {...props} />
    </Layout>
  );
};

export default ChangePassword;
