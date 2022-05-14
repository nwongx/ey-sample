import { Button, Avatar } from '@mui/material';
import React, { FC } from 'react';

type Props = {
  imgURL: string;
  token: string;
};

const TokenModalButton: FC<Props> = function ({ imgURL, token }) {
  return (
    <Button
      sx={{
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        color: 'rgb(69, 42, 122)',

        '& 	.MuiButton-startIcon': {
          marginRight: '4px',
        },
        '&:hover': {
          borderRadius: 20,
        },
      }}
      startIcon={
        <Avatar
          sx={{
            width: '1.7rem',
            height: '1.7rem',
          }}
          src={imgURL}
        />
      }
    >
      {token}
    </Button>
  );
};

export default TokenModalButton;
