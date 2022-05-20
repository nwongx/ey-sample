import React from 'react';
import { Box, Typography } from '@mui/material';

export interface IDisplayContent {
  title: string;
  content: string | number;
}

const contentStyle = {
  overflowWrap: 'anywhere',
};

const TransferInfoRow: React.FC<IDisplayContent> = function ({
  title,
  content,
}) {
  return (
    <Box>
      <Typography variant="subtitle1">{title}</Typography>
      <Typography sx={contentStyle}>{content}</Typography>
    </Box>
  );
};

export default TransferInfoRow;
