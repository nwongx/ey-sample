import { Button, Divider, Input, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { FC } from 'react';
import SwapInput from './SwapInput';
import TokenModalButton from './TokenModalButton';

type Props = {

};

const Swap: FC<Props> = function () {
  return (
    <Box
      sx={(theme) => ({
        width: 400,
        borderRadius: 3,
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px'
      })}
    >
      <Box
        sx={{
          p: 2,
        }}
      >
        <Typography variant='h6'>Swap</Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box
          sx={(theme) => ({
            borderRadius: 3,
            padding: '0.75rem',
            paddingBottom: '1rem',
            backgroundColor: 'rgb(238, 234, 244)',
            boxShadow: 'rgb(74 74 104 / 10%) 0px 2px 2px -1px'
          })}
        >
          <Typography
            sx={{
              color: 'rgb(69, 42, 122)'
            }}
            align='left'
            variant='subtitle2'
          >From</Typography>
          <SwapInput
            endAdornment={
              <TokenModalButton
                imgURL='https://www.logo.wine/a/logo/Binance/Binance-BNB-Icon2-Logo.wine.svg'
                token='BNB'
              />}
          />
        </Box>
        <Box>arrow</Box>
        <Box
          sx={(theme) => ({
            borderRadius: 3,
            padding: '0.75rem',
            paddingBottom: '1rem',
            backgroundColor: 'rgb(238, 234, 244)',
            boxShadow: 'rgb(74 74 104 / 10%) 0px 2px 2px -1px'
          })}
        >
          <Typography
            sx={{
              color: 'rgb(69, 42, 122)'
            }}
            align='left'
            variant='subtitle2'
          >From</Typography>
          <SwapInput
            endAdornment={
              <TokenModalButton
                imgURL='https://www.logo.wine/a/logo/Binance/Binance-BNB-Icon2-Logo.wine.svg'
                token='BNB'
              />}
          />
        </Box>
        <Button>Unlock Wallet/Swap</Button>

      </Box>
    </Box>
  )
}

export default Swap;