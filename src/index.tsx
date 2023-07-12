import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '$root/app';

import '$root/styles.css';

const rootElement = document.getElementById('root');

if (rootElement !== null) {
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
