/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectProps,
} from '@mui/material';

export interface IItemProps {
  id: string;
  selectValue: string;
  displayValue: string;
}

type TLabelSelectProps<T extends IItemProps> = SelectProps & {
  id: string;
  defaultValue: string;
  items: T[];
};

const LabelSelect: <T extends IItemProps>(
  props: TLabelSelectProps<T>
) => ReactElement = function ({ id, items, defaultValue, label, ...props }) {
  return (
    <FormControl>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        label={label}
        defaultValue={defaultValue}
        {...props}
      >
        {items.map(function (item) {
          return (
            <MenuItem key={item.id} value={item.selectValue}>
              {item.displayValue}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default LabelSelect;
