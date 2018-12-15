import React, { Fragment } from 'react';
import Layout from './Layout';

const HomeContent = props => {
  return (
    <Fragment>
      <h1>Home</h1>
      <p>This is home page content</p>
    </Fragment>
  )
}

const HomePage = () => {
  return (
    <Layout>
      {/* To have ReactComponent inside Layout */}
      <HomeContent />
    </Layout>
  );
}

export default HomePage;
