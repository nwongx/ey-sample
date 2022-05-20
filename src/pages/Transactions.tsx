import { Typography, Paper, Grid, Box } from '@mui/material';
import axios from 'axios';
import React, { FC, useContext, useEffect, useState } from 'react';
import dateFormat from 'dateformat';
import { WalletContext } from '../contexts/walletContext';

export interface IBSCTx {
  blockNumber: string;
  blockHash: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  txreceipt_status: string;
  gasUsed: string;
  confirmations: string;
  isError: string;
}

const layoutStyle = {
  boxSizing: 'border-box',
  height: '100%',
  overflow: 'scroll',
  padding: 2,
  gap: 2,
};

const paperStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  padding: 2,
};

const contentSyles = {
  overflowWrap: 'anywhere',
};

const Transactions: FC = function () {
  const [transactions, setTransactions] = useState<IBSCTx[]>([]);
  const { accounts } = useContext(WalletContext);

  useEffect(
    function () {
      async function fetchTransactions() {
        if (accounts) {
          const res = await axios.get<{ status: string; result: IBSCTx[] }>(
            `https://api-testnet.bscscan.com/api?module=account&action=txlist&address=${
              accounts[0]
            }&startblock=1&endblock=9999999999&sort=desc&apikey=${
              process.env.REACT_APP_API_KEY as string
            }&page=1&offset=10`
          );
          if (res.data.status === '1') {
            setTransactions(res.data.result);
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetchTransactions();
    },
    [accounts]
  );

  return (
    <Grid container flexDirection="column" flexWrap="nowrap" sx={layoutStyle}>
      {transactions.map(function (tx: IBSCTx) {
        return (
          <Paper sx={paperStyles} key={tx.blockHash} elevation={5}>
            <Box>
              <Typography>Block number</Typography>
              <Typography sx={contentSyles}>{tx.blockNumber}</Typography>
            </Box>
            <Box>
              <Typography>Date</Typography>
              <Typography sx={contentSyles}>
                {dateFormat(
                  parseInt(tx.timeStamp, 10) * 1000,
                  'mm/dd/yyyy hh:MM:ss'
                )}
              </Typography>
            </Box>
            <Box>
              <Typography>From</Typography>
              <Typography sx={contentSyles}>{tx.from}</Typography>
            </Box>
            <Box>
              <Typography>To</Typography>
              <Typography sx={contentSyles}>{tx.to}</Typography>
            </Box>
            <Box>
              <Typography>Gas fee</Typography>
              <Typography sx={contentSyles}>
                {parseInt(tx.gasPrice, 10) * parseInt(tx.gasUsed, 10)}
              </Typography>
            </Box>
            <Box>
              <Typography>Amount</Typography>
              <Typography sx={contentSyles}>{tx.value}</Typography>
            </Box>
          </Paper>
        );
      })}
    </Grid>
  );
};

export default Transactions;
