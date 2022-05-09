import { Grid, makeStyles } from '@mui/material';
import React, { FC, useContext, useEffect, useState } from 'react';
import { ISymbolMSG, MarketPriceSocketContext } from '../contexts/marketPriceSocket';

export interface ISymbol {
  id: string,
  token: string,
  symbol: string,
  address: string
}

type Props = {
  symbol: ISymbolMSG

}

const SymbolItem: FC<Props> = function ({ symbol }) {
  const [price, setPrice] = useState<string>('---');
  const [updateTime, setUpdateTime] = useState<number>(0);

  useEffect(() => {
    if (symbol) {
      if (symbol.E - updateTime > 5000) {
        setPrice(symbol.p);
        setUpdateTime(symbol.E);
      }
    }
  }, [
    symbol,
    updateTime,
    setPrice,
    setUpdateTime
  ])

  return (
    <Grid
      sx={(theme) => ({
        p: 1,
        width: '100%',
        height: 70,
        borderBottom: 1,
        borderColor: theme.palette.grey[400],
      })}
      container
      justifyContent='space-between'
      alignItems='center'
    >
      <Grid>
        {symbol.s}
      </Grid>
      <Grid>
        {price}
      </Grid>
    </Grid>
  )
}

export default SymbolItem;