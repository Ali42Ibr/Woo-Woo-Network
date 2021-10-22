import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

/**
 * @notice please make sure to use unique key when using dialog to refresh the dialog
 */
const AlertDialog = ({ isOpen, title, message, confirm, cancel }) => {
  const [open, setOpen] = React.useState(isOpen);
  useEffect(() => {
    console.log(isOpen);
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
  };

  const onConfirm = () => {
    if (confirm) {
      confirm();
    }
    handleClose();
  };

  const onCancel = () => {
    if (cancel) {
      cancel();
    }
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color="primary">
          Yes
        </Button>
        <Button onClick={onCancel} color="primary" autoFocus>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
