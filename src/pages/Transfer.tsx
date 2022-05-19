import { Box, Button, Divider, Grid, Typography } from '@mui/material';
import React, { FC, useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import { WalletContext } from '../contexts/walletContext';
import TransferForm from '../components/TransferForm';
import type { IFormData } from '../components/TransferForm';

interface IRawTx {
  from: string;
  to: string;
  data?: string;
  chainId: string;
}

const Transfer: FC = function () {
  const [tokenAddress, setTokenAddress] = useState('native');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);
  const [estimatedGas, setEstimatedGas] = useState(0);
  const [rawTx, setRawTx] = useState<IRawTx | null>(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { accounts } = useContext(WalletContext);

  useEffect(
    function () {
      async function createRawTx() {
        if (accounts) {
          try {
            if (tokenAddress === 'native') {
              const amountInWei = Web3.utils.toWei(amount);
              const rawTx = {
                from: accounts[0],
                to: toAddress,
                chainId: process.env.REACT_APP_CHAIN_ID as string,
              };
              setRawTx(rawTx);
              setOpen(true);
            } else {
              const res = await axios.get(`
        https://api-testnet.bscscan.com/api?module=contract&action=getabi&address=${tokenAddress}&apikey=${process.env.REACT_APP_BSC_API_KEY}`);
              const abi = JSON.parse(res.data.result);
              const web3 = new Web3(
                'https://data-seed-prebsc-1-s1.binance.org:8545/'
              );
              const amountInWei = Web3.utils.toWei(amount);
              const contract = new web3.eth.Contract(abi, tokenAddress, {
                from: accounts[0],
              });
              const data = await contract.methods
                .transfer(toAddress, amountInWei.toString())
                .encodeABI();
              const rawTx = {
                from: accounts[0],
                to: tokenAddress,
                data,
                chainId: process.env.REACT_APP_CHAIN_ID as string,
              };
              setRawTx(rawTx);
              setOpen(true);
            }
          } catch (e) {
            console.log(e);
          }
        }
      }

      createRawTx();
    },
    [estimatedGas]
  );

  function onSubmitHanlder(formData: IFormData) {
    console.log('formData', formData);
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={(theme) => ({
            boxSizing: 'border-box',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            p: 4,
            width: '80%',
            maxWidth: 400,
            backgroundColor: 'white',
            borderRadius: 3,
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
          })}
        >
          <Box>{`from: ${accounts && accounts[0] ? accounts[0] : '---'}`}</Box>
          <Box>{`to: ${toAddress}`}</Box>
          <Box>{`estimate Gas ${estimatedGas}`}</Box>
          <Button
            onClick={async () => {
              const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [rawTx],
              });
            }}
            variant="contained"
            disabled={!estimatedGas}
          >
            Confirm
          </Button>
        </Box>
      </Modal>
      <Grid
        sx={{
          p: 1,
          flex: 1,
          height: '100%',
        }}
        container
        item
        justifyContent="center"
        alignItems="center"
      >
        <Box
          sx={(theme) => ({
            width: 400,
            borderRadius: 3,
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
          })}
        >
          <Box
            sx={{
              p: 2,
            }}
          >
            <Typography variant="h6">Transfer</Typography>
          </Box>
          <Divider />
          <TransferForm onSubmitHandler={onSubmitHanlder} />
        </Box>
      </Grid>
    </>
  );
};

export default Transfer;
