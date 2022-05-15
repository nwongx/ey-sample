/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectProps,
} from '@mui/material';

type TProps<T extends { [k in keyof T]: string | boolean | null }> =
  SelectProps & {
    id: string;
    defaultValue: string;
    items: T[];
    itemIdKey: keyof T;
    itemValueKey: keyof T;
    itemDisplayKey: keyof T;
  };

const LabelSelect: <T extends { [k in keyof T]: string | boolean | null }>(
  props: TProps<T>
) => ReactElement = function ({
  id,
  items,
  itemIdKey,
  itemValueKey,
  itemDisplayKey,
  defaultValue,
  label,
  ...props
}) {
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
          const key: string =
            typeof item[itemIdKey] === 'string' ? item[itemIdKey] : '';
          const value: string =
            typeof item[itemValueKey] === 'string'
              ? item[itemValueKey]
              : defaultValue;
          return (
            <MenuItem key={key} value={value}>
              {item[itemDisplayKey]}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default LabelSelect;
