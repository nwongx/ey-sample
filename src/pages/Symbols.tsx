import React from 'react';
import MarketPriceList from '../components/MarketPriceList';
import MarketPriceSocketProvider from '../contexts/marketPriceSocket';


const Symbols = function () {
  return (
    <MarketPriceSocketProvider>
      <MarketPriceList />
    </MarketPriceSocketProvider>

  )
}

export default Symbols;