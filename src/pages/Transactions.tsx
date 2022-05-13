import { Box } from '@mui/system';
import axios from 'axios';
import React, { FC, useContext, useEffect, useState } from 'react';
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

const Transactions: FC = function () {
  const [transactions, setTransactions] = useState([]);
  const { accounts } = useContext(WalletContext);

  useEffect(function () {
    async function fetchTransactions() {
      if (accounts) {
        const res = await axios.get(`https://api-testnet.bscscan.com/api?module=account&action=txlist&address=${accounts[0]}&startblock=1&endblock=9999999999&sort=desc&apikey=${process.env.REACT_APP_API_KEY}&page=1&offset=10`)
        if (res.data.status === '1') {
          setTransactions(res.data.result)
        }
      }
    }

    fetchTransactions();
  }, [accounts])

  return (
    <Box>
      {
        transactions.map(function (tx: IBSCTx) {
          return (
            <Box key={tx.blockHash} sx={{ margin: 2, overflowWrap: 'break-word'}}>
              <Box>{tx.blockNumber}</Box>
              <Box>{tx.from}</Box>
              <Box>{tx.gasPrice} {tx.gasUsed}</Box>
              <Box>{tx.isError}</Box>
              <Box>{tx.to}</Box>
              <Box>{tx.timeStamp}</Box>
              <Box>{tx.value}</Box>
            </Box>
          )
        })
      }
    </Box>
  )
}

export default Transactions;