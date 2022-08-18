import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import './styles/styles.css';
import { client } from './apollo';
import { ApolloProvider } from '@apollo/client';
import { HelmetProvider } from 'react-helmet-async';
import { App } from './components/App';

/* Remove <React.StrictMode> to Use Google-Map-React */
/* - Doc: https://stackoverflow.com/questions/72115135/google-map-react-not-loading-uncaught-typeerror-cannot-read-properties-of-unde */

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  /* <React.StrictMode> */
    <ApolloProvider client={client}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </ApolloProvider>
  /* </React.StrictMode> */
);

/* If you want to start measuring performance in your app, pass a function
to log results (for example: reportWebVitals(console.log))
or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals */
reportWebVitals();
