import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as TanStackQueryProvider from './integration/tanstack-query';

import './styles/fonts.css';
import './styles/style.css';

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <App />
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  );
}
