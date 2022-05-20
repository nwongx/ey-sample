import React from 'react';
import { Modal, Button, ModalProps, Grid } from '@mui/material';
import type { IDisplayContent } from './TransferInfoRow';
import TransferInfoRow from './TransferInfoRow';

interface ITransferConfirmModalProps extends Omit<ModalProps, 'children'> {
  displayContent: IDisplayContent[];
  onConfirm: () => void;
}

const layoutStyles = {
  boxSizing: 'border-box',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  p: 4,
  width: '80%',
  maxWidth: 400,
  backgroundColor: 'white',
  borderRadius: 3,
  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
};

const gridStyles = {
  gap: '12px',
  marginBottom: '16px',
};

const TransferConfirmModal: React.FC<ITransferConfirmModalProps> = function ({
  displayContent,
  onConfirm,
  ...props
}) {
  return (
    <Modal
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <Grid container sx={layoutStyles} justifyContent="center">
        <Grid container flexDirection="column" sx={gridStyles}>
          {displayContent.map(function ({ title, content }) {
            return (
              <TransferInfoRow key={title} title={title} content={content} />
            );
          })}
        </Grid>
        <Button onClick={onConfirm} variant="contained">
          Confirm
        </Button>
      </Grid>
    </Modal>
  );
};

export default TransferConfirmModal;
