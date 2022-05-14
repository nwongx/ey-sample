import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createTheme, Box } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import BottomAppBar from './components/AppBar';
import Symbols from './pages/Symbols';
import Transfer from './pages/Transfer';
import WalletProvider from './contexts/walletContext';
import Transactions from './pages/Transactions';

const theme = createTheme({
  typography: {
    subtitle2: {
      fontWeight: 600,
    }
  }
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <WalletProvider>
          <Box
            sx={{
              height: 'calc(100vh - 56px)',
              boxSizing: 'border-box',
            }}
          >
            <Routes>
              <Route path="/" element={<Symbols />} />
              <Route path="/transfer" element={<Transfer />} />
              <Route path="/transactions" element={<Transactions />} />
            </Routes>
          </Box>
          <BottomAppBar />
        </WalletProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
