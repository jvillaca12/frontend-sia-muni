import React from 'react';
import ReactDOM from 'react-dom/client';
import theme from 'theme/theme.ts';
import { RouterProvider } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import BreakpointsProvider from 'providers/BreakpointsProvider.tsx';
import router from 'routes/router';
import './index.css';
import { GlobalStateProvider } from 'components/context/GlobalState';

// Polyfill para `global`
if (typeof global === 'undefined') {
  window.global = window;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GlobalStateProvider>
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <BreakpointsProvider>
          <CssBaseline />
            <RouterProvider router={router} />
        </BreakpointsProvider>
      </ThemeProvider>
    </React.StrictMode>,
  </GlobalStateProvider>,
);
