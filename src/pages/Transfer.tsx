import { Box, Divider, Grid, Typography } from '@mui/material';
import React, { FC, useContext, useState } from 'react';
import { WalletContext } from '../contexts/walletContext';
import TransferForm from '../components/TransferForm';
import type { IFormData } from '../components/TransferForm';
import { simplifiedBEP20Abi } from '../data/abi';
import TransferConfirmModal from '../components/TransferConfirmModal';

interface IRawTx {
  from?: string;
  to?: string;
  value?: string;
  data?: string;
  chainId?: string;
}

const gridStyles = {
  p: 1,
  flex: 1,
  height: '100%',
};

const formLayoutStyles = {
  width: 400,
  borderRadius: 3,
  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
};

const formHeaderStyles = {
  p: 2,
};

const Transfer: FC = function () {
  const [transferParam, setTransferParam] = useState<IFormData | null>(null);
  const [open, setOpen] = useState(true);
  const { web3, accounts } = useContext(WalletContext);

  function handleClose() {
    setOpen(false);
  }

  function handleOpen() {
    setOpen(true);
  }

  function onSubmitHanlder(formData: IFormData) {
    if (formData.isValid) {
      handleOpen();
    }
    setTransferParam(formData);
  }

  function onConfirmHandler() {
    async function sendTransaction() {
      if (transferParam && accounts) {
        let rawTx: IRawTx = {};
        try {
          if (transferParam.tokenAddress === 'native') {
            rawTx = {
              from: accounts[0],
              to: transferParam.toAddress as string,
              value: web3.utils.toHex(transferParam.amount as string),
              chainId: process.env.REACT_APP_CHAIN_ID as string,
            };
          } else {
            const contract = new web3.eth.Contract(
              simplifiedBEP20Abi,
              transferParam.tokenAddress as string,
              {
                from: accounts[0],
              }
            );
            /* eslint-disable @typescript-eslint/no-unsafe-call,  
        @typescript-eslint/no-unsafe-member-access,  
        @typescript-eslint/no-unsafe-assignment */
            const data: string = await contract.methods
              .transfer(
                transferParam.toAddress as string,
                transferParam.amount as string
              )
              .encodeABI();

            /* eslint-enable @typescript-eslint/no-unsafe-call,  
        @typescript-eslint/no-unsafe-member-access,  
        @typescript-eslint/no-unsafe-assignment */
            rawTx = {
              from: accounts[0],
              to: transferParam.tokenAddress as string,
              data,
              chainId: process.env.REACT_APP_CHAIN_ID as string,
            };
          }
          await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [rawTx],
          });

          // todo: redirect to explore
        } catch (e) {
          // todo: error handling
          console.log(e);
        } finally {
          handleClose();
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    sendTransaction();
  }

  return (
    <>
      {transferParam?.toAddress &&
        transferParam?.tokenAddress &&
        transferParam.amount &&
        transferParam.estimatedGas && (
          <TransferConfirmModal
            open={open}
            onClose={handleClose}
            onConfirm={onConfirmHandler}
            displayContent={[
              {
                title: 'To',
                content: transferParam.toAddress,
              },
              {
                title: 'Token address',
                content: transferParam.tokenAddress,
              },
              {
                title: 'Amount',
                content: transferParam.amount,
              },
              {
                title: 'Estimated Gas',
                content: transferParam.estimatedGas,
              },
            ]}
          />
        )}
      <Grid
        sx={gridStyles}
        container
        item
        justifyContent="center"
        alignItems="center"
      >
        <Box sx={formLayoutStyles}>
          <Box sx={formHeaderStyles}>
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
