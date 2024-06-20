import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Helmet from 'react-helmet'
import "./config/trustedSecurityPolicies";
import { BrowserRouter } from "react-router-dom";

const csp = `
default-src 'self';
script-src http://localhost:3000 http://localhost:3001 http://localhost:3002 'strict-dynamic';
require-trusted-types-for 'script';
style-src 'self' 'unsafe-inline';
connect-src 'self' http://localhost:3000 http://localhost:3001 http://localhost:3002;
img-src 'self' http://localhost:3000 http://localhost:3001 http://localhost:3002 data:;
frame-src 'self' ;
object-src 'none';
`;

let metas = [];


metas.push(
  <meta key={0} http-equiv="Content-Security-Policy" content={csp} />
);
metas.push(
  <meta
    key={0}
    http-equiv="X-Permitted-Cross-Domain-Policies"
    content="none"
  />
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Helmet>
      {metas}
    </Helmet>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);