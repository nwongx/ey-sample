import { Box, Button, Divider, Grid, Typography } from '@mui/material';
import React, { FC, useContext, useEffect, useReducer, useState } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import { WalletContext } from '../contexts/walletContext';
import TransferForm from '../components/TransferForm';

const FAILURE_TRANSFER_TOKEN = 'FAILURE_TRANSFER_TOKEN';
const SUCCESS_TRANSFER_TOKEN = 'SUCCESS_TRANSFER_TOKEN';

type TTransferError = string | null;
interface ITransferState {
  toError: TTransferError;
  amountError: TTransferError;
}

interface ITransferActionPayload {
  toError: TTransferError;
  amountError: TTransferError;
}

interface IRawTx {
  from: string;
  to: string;
  data?: string;
  chainId: string;
}

type TTransferAction = {
  type: 'SUCCESS_TRANSFER_TOKEN' | 'FAILURE_TRANSFER_TOKEN';
  payload: ITransferActionPayload;
};

const transferInitialState: ITransferState = {
  toError: null,
  amountError: null,
};

const reducer = function (
  state: ITransferState,
  action: TTransferAction
): ITransferState {
  switch (action.type) {
    case FAILURE_TRANSFER_TOKEN:
      return {
        ...state,
        toError: action.payload.toError,
        amountError: action.payload.amountError,
      };
    case SUCCESS_TRANSFER_TOKEN:
      return {
        ...state,
        toError: null,
        amountError: null,
      };
    default:
      return state;
  }
};

const Transfer: FC = function () {
  const [state, dispatch] = useReducer(reducer, transferInitialState);
  const [tokenAddress, setTokenAddress] = useState('native');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [estimatedGas, setEstimatedGas] = useState(0);
  const [rawTx, setRawTx] = useState<IRawTx | null>(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { accounts } = useContext(WalletContext);

  useEffect(
    function () {
      if (!accounts || accounts.length === 0) return;
      // get balance
      // set balance
    },
    [tokenAddress]
  );

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

  useEffect(
    function () {
      async function submitHandler() {
        setIsSubmitted((prev) => !prev);
        const payload: ITransferActionPayload = {
          toError: null,
          amountError: null,
        };
        const web3 = new Web3(
          'https://data-seed-prebsc-1-s1.binance.org:8545/'
        );
        //is valid to address
        if (!Web3.utils.isAddress(toAddress)) {
          payload.toError = 'Invalid address';
        }

        //is valid amount
        const amountInWei = Web3.utils.toWei(amount);
        if (tokenAddress === 'native') {
          if (accounts) {
            const estimatedGas = await web3.eth.estimateGas({
              from: accounts[0],
              to: toAddress,
              value: web3.utils.toWei(amount),
            });
            console.log(estimatedGas);
            setEstimatedGas(estimatedGas);
          }
        } else {
          try {
            const res = await axios.get(`
          https://api-testnet.bscscan.com/api?module=contract&action=getabi&address=${tokenAddress}&apikey=${process.env.REACT_APP_BSC_API_KEY}`);
            const abi = JSON.parse(res.data.result);
            if (accounts) {
              const contract = new web3.eth.Contract(abi, tokenAddress, {
                from: accounts[0],
              });
              const estimatedGas = await contract.methods
                .transfer(toAddress, amountInWei.toString())
                .estimateGas();
              setEstimatedGas(estimatedGas);
            }
          } catch (e: unknown) {
            if (e instanceof Error) {
              if (e.message.includes('transfer amount exceeds balance')) {
                // show error msg
                dispatch({
                  type: FAILURE_TRANSFER_TOKEN,
                  payload: {
                    ...state,
                    amountError: 'transfer amount excceds balance',
                  },
                });
              } else if (e.message.includes('invalid address')) {
                dispatch({
                  type: FAILURE_TRANSFER_TOKEN,
                  payload: {
                    ...state,
                    toError: 'invalid address',
                  },
                });
              } else {
                console.log(e);
              }
            }
          }
        }
        // if not valid, dispatch error
        // else show transfer detail
      }
      if (isSubmitted) {
        submitHandler();
      }
    },
    [isSubmitted]
  );

  function onSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitted(true);
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
          <TransferForm onSubmit={onSubmit} />
        </Box>
      </Grid>
    </>
  );
};

export default Transfer;
