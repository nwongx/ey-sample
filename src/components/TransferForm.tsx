import React, { useState } from 'react';
import { Grid, Button, SelectChangeEvent } from '@mui/material';
import HelperTextTextField from './HeplerTextTextField';
import { supportTokens } from '../data/supportToken';
import LabelSelect from './LabelSelect';

const transferableTokens = supportTokens.filter(function (token) {
  return token.isTransferable;
});

interface IProps {
  onSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void;
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
};

const TransferForm: React.FC<IProps> = function ({ onSubmit }) {
  const [tokenAddress, setTokenAddress] = useState('native');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [toAddressError, setToAddressError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);

  function onTokenChange(e: SelectChangeEvent) {
    setTokenAddress(e.target.value);
  }

  function onToAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
    setToAddress(e.target.value);
  }

  function onAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAmount(e.target.value);
  }

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
          itemDisplayKey="token"
          itemIdKey="id"
          itemValueKey="token"
          items={transferableTokens}
          // onChange={onTokenChange}
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
        <Button
          type="submit"
          // disabled={!accounts || accounts.length === 0}
          sx={buttonStyles}
        >
          transfer
          {/* {!accounts || accounts.length === 0
            ? 'please connect to metamask'
            : 'transfer'} */}
        </Button>
      </Grid>
    </form>
  );
};

export default TransferForm;
