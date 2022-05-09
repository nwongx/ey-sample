import { Button, Divider, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { FC } from 'react';
import SwapInput from '../components/SwapInput';
import TokenModalButton from '../components/TokenModalButton';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

type Props = {

};

const Swap: FC<Props> = function () {
  return (
    <Grid
      sx={{
        p: 1,
        flex: 1,
        height: '100%'
      }}
      container
      item
      justifyContent='center'
      alignItems='center'

    >
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
            padding: '24px 18px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={(theme) => ({
              width: '100%',
              boxSizing: 'border-box',
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
          <Box>
            <ArrowDownwardIcon
              sx={{
                color: 'rgb(31, 199, 212);',
                backgroundColor: 'rgb(239, 244, 245)',
                width: 32,
                height: 32,
                borderRadius: '50%',
                fontSize: 14,
                padding: '0.2rem'
              }} />
          </Box>
          <Box
            sx={(theme) => ({
              width: '100%',
              boxSizing: 'border-box',
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
          <Button
            sx={{
              marginTop: 3,
              color: 'white',
              fontWeight: 600,
              height: 48,
              width: '100%',
              borderRadius: 3,
              backgroundColor: 'rgb(31, 199, 212)'
            }}
          >Unlock Wallet/Swap</Button>

        </Box>
      </Box>
    </Grid>
  )
}

export default Swap;