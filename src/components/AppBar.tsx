import { AppBar, IconButton, Toolbar, Box } from '@mui/material';
import React, { FC } from 'react';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Link } from 'react-router-dom';


type Props = {

}

const BottomAppBar: FC<Props> = function () {
  return (
    <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
      <Toolbar>
        <Link style={{
          flex: 1,
          textAlign: 'center',
          textDecoration: 'none'
        }} to='/symbols'>
          <ShowChartIcon />
        </Link>
        <Link style={{
          flex: 1,
          textAlign: 'center',
          textDecoration: 'none'
        }} to='/swap'>
          <SwapVertIcon />
        </Link>
        <Link style={{
          flex: 1,
          textAlign: 'center',
          textDecoration: 'none'
        }} to='/transactions'>
          <ListAltIcon />
        </Link>
      </Toolbar>
    </AppBar>
  )
}

export default BottomAppBar;