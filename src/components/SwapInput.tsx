import React, { FC } from 'react';
import { InputUnstyled, InputUnstyledProps, inputUnstyledClasses } from '@mui/base';
import { styled } from '@mui/system';

const StyledInputRoot = styled('div')(
  ({ theme }) => `
  display: flex;
  padding-top: 0.75rem;
  font-weight: 500;
  border: none;
  background: none;
  align-items: center;
  justify-content: center;

  &.${inputUnstyledClasses.focused} {
    outline: none;
  }

  &:hover {
    background: none;
    border-color: none;
  }
`,
);

const StyledInputElement = styled('input')(
  ({ theme }) => ({
    fontSize: '1.1rem',
    color: 'rgb(69, 42, 122)',
    fontWeight: 500,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: 'transparent',
    width: '100%',
    border: 0,
    '&: hover': {
      border: 0,
    },
    '&: focus': {
      outline: 0,
    }
  })
)


const CustomInput = React.forwardRef(function CustomInput(
  props: InputUnstyledProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { components, ...other } = props;

  return (
    <InputUnstyled components={{
      Root: StyledInputRoot,
      Input: StyledInputElement,
      ...components
    }}
      {...other}
      ref={ref}
    />
  )
})

const SwapInput: FC<InputUnstyledProps> = function (props: InputUnstyledProps) {
  return (
    <CustomInput aria-label="Transfer amount" placeholder='Type something...' {...props} />
  )
}

export default SwapInput;