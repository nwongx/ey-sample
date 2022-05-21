import React, { useCallback, useContext, useState } from 'react';
import { Grid, Button, SelectChangeEvent } from '@mui/material';
import HelperTextTextField from './HeplerTextTextField';
import { supportTokens } from '../data/supportToken';
import LabelSelect from './LabelSelect';
import type { IItemProps } from './LabelSelect';
import { WalletContext } from '../contexts/walletContext';
import { simplifiedBEP20Abi } from '../data/abi';

const transferableTokens = supportTokens.reduce<IItemProps[]>(function (
  tokens,
  token
) {
  if (!token.isTransferable) return tokens;
  tokens.push({
    id: token.id,
    selectValue: token.address as string,
    displayValue: token.token,
  });
  return tokens;
},
[]);

export interface IFormData {
  isValid: boolean;
  tokenAddress?: string;
  toAddress?: string;
  amount?: string;
  estimatedGas?: number;
}

interface ITransferFormProps {
  onSubmitHandler: (formData: IFormData) => void;
  disabled: boolean;
  disabledTitle: string;
  enabledTitle: string;
}

const formStyles = {
  p: 2,
  paddingBottom: 4,
  gap: 2,
};

const buttonStyles = {
  marginTop: 3,
  color: 'white',
  fontWeight: 600,
  height: 48,
  width: '100%',
  borderRadius: 3,
  backgroundColor: 'rgb(31, 199, 212)',
  '&:hover': {
    backgroundColor: 'rgba(31, 199, 212, 0.75)',
  },
  '&:disabled': {
    backgroundColor: 'rgba(31, 199, 212, 0.35)',
    height: 56,
  },
};

const TransferForm: React.FC<ITransferFormProps> = function ({
  onSubmitHandler,
  disabled,
  disabledTitle,
  enabledTitle,
}) {
  const { web3, accounts } = useContext(WalletContext);
  const [tokenAddress, setTokenAddress] = useState('native');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [toAddressError, setToAddressError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);

  function onTokenChange(e: SelectChangeEvent<unknown>) {
    setTokenAddress(e.target.value as string);
  }

  function onToAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
    setToAddress(e.target.value);
  }

  function onAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAmount(e.target.value);
  }

  const onSubmit = useCallback(
    function (e: React.ChangeEvent<HTMLFormElement>) {
      e.preventDefault();

      async function asyncHelper() {
        if (!accounts || accounts.length === 0) {
          onSubmitHandler({
            isValid: false,
          });
          return;
        }

        let isValid = true;
        let estimatedGas = 0;

        if (!web3.utils.isAddress(toAddress)) {
          setToAddressError('Invalid address');
          isValid = false;
        }

        const amountInWei = web3.utils.toWei(amount);
        try {
          if (tokenAddress === 'native') {
            const balance = await web3.eth.getBalance(accounts[0]);
            // do not check gas fee as user can adjust in metamask
            if (parseInt(balance, 10) < parseInt(amountInWei, 10)) {
              throw new Error('transfer amount exceed balance');
            }
            estimatedGas = 21000;
          } else {
            const contract = new web3.eth.Contract(
              simplifiedBEP20Abi,
              tokenAddress,
              {
                from: accounts[0],
              }
            );
            /* eslint-disable @typescript-eslint/no-unsafe-call,  
          @typescript-eslint/no-unsafe-member-access,  
          @typescript-eslint/no-unsafe-assignment */
            estimatedGas = await contract.methods
              .transfer(toAddress, amountInWei)
              .estimateGas();
            /* eslint-enable @typescript-eslint/no-unsafe-call,  
          @typescript-eslint/no-unsafe-member-access,  
          @typescript-eslint/no-unsafe-assignment */
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            if (err.message.includes('transfer amount')) {
              setAmountError('invalid amount');
            }
          }
          isValid = false;
        }

        if (!isValid) {
          onSubmitHandler({
            isValid,
          });
        } else {
          setAmountError(null);
          setToAddressError(null);
          setToAddress('');
          setAmount('');
          setTokenAddress('native');
          onSubmitHandler({
            isValid,
            amount: amountInWei,
            toAddress,
            tokenAddress,
            estimatedGas,
          });
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      asyncHelper();
    },
    [
      accounts,
      amount,
      onSubmitHandler,
      toAddress,
      tokenAddress,
      web3.eth,
      web3.utils,
    ]
  );

  return (
    <form onSubmit={onSubmit}>
      <Grid
        sx={formStyles}
        container
        justifyContent="center"
        flexDirection="column"
      >
        <LabelSelect
          id="token-select"
          label="Token"
          defaultValue={tokenAddress}
          value={tokenAddress}
          items={transferableTokens}
          onChange={onTokenChange}
        />
        <HelperTextTextField
          required
          value={toAddress}
          errorMsg={toAddressError}
          label="To"
          onChange={onToAddressChange}
        />
        <HelperTextTextField
          required
          value={amount}
          errorMsg={amountError}
          label="Amount"
          onChange={onAmountChange}
        />
        <Button disabled={disabled} type="submit" sx={buttonStyles}>
          {disabled ? disabledTitle : enabledTitle}
        </Button>
      </Grid>
    </form>
  );
};

export default TransferForm;
