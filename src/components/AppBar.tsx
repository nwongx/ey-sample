import { AppBar, IconButton, Toolbar, Box } from '@mui/material';
import React, { FC, useContext } from 'react';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Link } from 'react-router-dom';
import { WalletContext } from '../contexts/walletContext';

type Props = {};

const BottomAppBar: FC<Props> = function () {
  const { accounts, setAccounts, isMetaMaskInstalled } =
    useContext(WalletContext);

  return (
    <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
      <Toolbar>
        <Link
          style={{
            flex: 1,
            textAlign: 'center',
            textDecoration: 'none',
          }}
          to="/"
        >
          <ShowChartIcon />
        </Link>
        <Link
          style={{
            flex: 1,
            textAlign: 'center',
            textDecoration: 'none',
          }}
          to="/transfer"
        >
          <SwapVertIcon />
        </Link>
        {accounts && isMetaMaskInstalled ? (
          accounts.length === 0 ? (
            <IconButton
              sx={{ flexGrow: 1 }}
              onClick={async () => {
                const { ethereum } = window;
                if (!ethereum && !ethereum.isMetaMask) return;
                try {
                  const newAccounts = await ethereum.request({
                    method: 'eth_requestAccounts',
                  });
                  if (!setAccounts) throw new Error('setAccounts is undefined');
                  setAccounts(newAccounts);
                } catch (error) {
                  console.error(error);
                }
              }}
            >
              <AccountBalanceWalletIcon />
            </IconButton>
          ) : (
            <Link
              style={{
                flex: 1,
                textAlign: 'center',
                textDecoration: 'none',
              }}
              to="/transactions"
            >
              <ListAltIcon />
            </Link>
          )
        ) : null}
      </Toolbar>
    </AppBar>
  );
};

export default BottomAppBar;
