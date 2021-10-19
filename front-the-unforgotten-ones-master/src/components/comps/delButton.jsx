import React from 'react';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import SmallButton from './smlButton';

const useStyles = makeStyles((theme) => ({
  button: {
    //backgroundColor: theme.palette.button.orange,
  },
}));

function DeleteButton(props) {
  const classes = useStyles();

  if (props.contents != null) {
    return (
      <SmallButton
        variant="contained"
        margin="dense"
        size="small"
        color="primary"
        startIcon={<DeleteIcon />}
        contents={props.contents}
        {...props}
      />
    );
  } else {
    return (
      <SmallButton
        variant="contained"
        margin="dense"
        size="small"
        color="primary"
        contents={<DeleteIcon />}
        {...props}
      />
    );
  }
}
export default DeleteButton;
