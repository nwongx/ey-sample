import { AppBar, IconButton, Toolbar } from '@mui/material';
import React, { FC, useContext } from 'react';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Link } from 'react-router-dom';
import { WalletContext } from '../contexts/walletContext';

const linkStyles = {
  flex: 1,
  textAlign: 'center' as const,
  textDecoration: 'none' as const,
};

const iconsBtnStyles = {
  flex: 1,
  padding: 0,
};

const BottomAppBar: FC = function () {
  const { accounts, setAccounts, isMetaMaskInstalled } =
    useContext(WalletContext);

  function fetchAccounts() {
    async function helper() {
      if (!window.ethereum.isMetaMask) return;
      try {
        const newAccounts = await window.ethereum.request<string[]>({
          method: 'eth_requestAccounts',
        });
        if (setAccounts) setAccounts(newAccounts as string[]);
      } catch (e) {
        console.log(e);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    helper();
  }

  return (
    <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
      <Toolbar>
        <Link title="To symbol page" style={linkStyles} to="/">
          <ShowChartIcon />
        </Link>
        <Link title="To transfer page" style={linkStyles} to="/transfer">
          <SwapVertIcon />
        </Link>
        {isMetaMaskInstalled && accounts.length === 0 && (
          <IconButton
            title="Connect to Metamask"
            sx={iconsBtnStyles}
            disableRipple
            onClick={fetchAccounts}
          >
            <AccountBalanceWalletIcon />
          </IconButton>
        )}
        {isMetaMaskInstalled && accounts.length > 0 && (
          <Link
            title="To transactions page"
            style={linkStyles}
            to="/transactions"
          >
            <ListAltIcon />
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default BottomAppBar;
