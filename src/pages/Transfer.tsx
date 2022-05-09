import { Button, Divider, Grid, Input, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { FC } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

type Props = {

};

const Transfer: FC<Props> = function () {
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
          <Typography variant='h6'>Transfer</Typography>
        </Box>
        <Divider />
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          autoWidth
          label="Age"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Twenty</MenuItem>
          <MenuItem value={21}>Twenty one</MenuItem>
          <MenuItem value={22}>Twenty one and a half</MenuItem>
        </Select>
        <TextField
          label='From'
          variant='standard'
        />
        <TextField
          label='To'
          variant='standard'
        />
        <TextField
          label='Amount'
          variant='standard'
        />
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
        >Unlock Wallet/Transfer</Button>

      </Box>
    </Grid>
  )
}

export default Transfer;