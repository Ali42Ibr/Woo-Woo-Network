import React from 'react';
import { makeStyles } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import SmallButton from './smlButton';

const useStyles = makeStyles((theme) => ({
  button: {
    //backgroundColor: theme.palette.button.orange,
  },
}));

function SaveButton(props) {
  const classes = useStyles();

  if (props.contents != null) {
    return (
      <SmallButton
        variant="contained"
        margin="dense"
        size="small"
        color="primary"
        startIcon={<SaveIcon />}
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
        startIcon={<SaveIcon />}
        contents="Save"
        {...props}
      />
    );
  }
}
export default SaveButton;
