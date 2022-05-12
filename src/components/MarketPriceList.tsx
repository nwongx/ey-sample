import React, { useContext } from 'react';
import { MarketPriceSocketContext, testSymbols } from '../contexts/marketPriceSocket';
import SymbolItem from './SymbolItem';



function MarketPriceList() {
  const symbolMsgs = useContext(MarketPriceSocketContext);

  return (
    <div>
      {
        testSymbols.reduce<React.ReactNode[]>(function(items, symbol) {
          if (!symbol.symbol) return items;

          const symbolMsg = symbolMsgs[symbol.symbol];
          if (!symbolMsg) return items;
          items.push(<SymbolItem key={symbol.id} symbol={symbolMsg} />)
          return items;
        }, [])
      }
    </div>
  )
}

export default MarketPriceList;