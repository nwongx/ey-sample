import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import BottomAppBar from './components/AppBar';
import { ThemeProvider } from '@emotion/react';
import { createTheme, Box } from '@mui/material';
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
              p: 2
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
