/* eslint-disable react/jsx-props-no-spreading */
import {
  FormControl,
  FormHelperText,
  TextField,
  TextFieldProps,
} from '@mui/material';
import React, { FC } from 'react';

interface HelperTextTextFieldProps {
  errorMsg: string | null;
}

type Props = HelperTextTextFieldProps & TextFieldProps;

const HelperTextTextField: FC<Props> = function ({ errorMsg, ...props }) {
  return (
    <FormControl>
      <TextField error={!!errorMsg} variant="standard" {...props} />
      {errorMsg && <FormHelperText>{errorMsg}</FormHelperText>}
    </FormControl>
  );
};

export default HelperTextTextField;
