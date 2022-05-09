import React, { useContext } from 'react';
import { MarketPriceSocketContext, testSymbols } from '../contexts/marketPriceSocket';
import SymbolItem from './SymbolItem';



function MarketPriceList() {
  const symbolMsgs = useContext(MarketPriceSocketContext);

  return (
    <div>
      {
        testSymbols.map(symbol => {
          const symbolMsg = symbolMsgs[symbol.symbol];
          if (!symbolMsg) return null;
          return <SymbolItem key={symbol.id} symbol={symbolMsg} />
        })
      }
    </div>
  )
}

export default MarketPriceList;