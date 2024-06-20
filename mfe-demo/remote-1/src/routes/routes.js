import React from 'react'
const Component1 = React.lazy(() => import('../components/component1'));
const Component2 = React.lazy(() => import('../components/component2'));

const routes = [
  {
    header: 'Component 1',
    routeUri: '/remote1/component1',
    component: <Component1 />
  },
  {
    header: 'Component 2',
    routeUri: '/remote1/component2',
    component: <Component2 />
  },
];

export default routes;
