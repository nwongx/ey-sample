import React, { useEffect, useState } from 'react';
import MarketPriceSocketProvider from './contexts/marketPriceSocket';
import MarketPriceList from './components/MarketPriceList';
import Swap from './components/Swap';
import { createTheme, Grid } from '@mui/material';
import { ThemeProvider } from '@emotion/react';

const theme = createTheme({
  typography: {
    subtitle2: {
      fontWeight: 600,
    }
  }
})

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Grid
        sx={{
          height: '100vh'
        }}
        container
        flexDirection='column'
        className="App"
      >
        <Grid>
          <MarketPriceSocketProvider>
            <MarketPriceList />
          </MarketPriceSocketProvider>
        </Grid>
        <Grid
          sx={{
            p: 1,
            flex: 1
          }}
          container
          item
          justifyContent='center'
          alignItems='center'

        >
          <Swap />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
