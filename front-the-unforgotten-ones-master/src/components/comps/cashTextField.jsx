import React from 'react';
import { makeStyles } from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Box from '@material-ui/core/Box';
import SmallTextField from './smlTextField';
//import globalStyles from './globalStyling.module.css';

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: theme.palette.background.orange,
    width: '40px',
    height: '40px',
    borderRadius: '4px 0px 0px 4px',
    marginTop: '8px',
    marginBottom: '4px',
    padding: '8px',
    borderWidth: '1px',
    borderStyle: 'solid none solid solid',
    borderColor: theme.palette.button.orange,
  },
  container: {
    display: 'flex',
  },
}));

function CashTextField(props) {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Box className={classes.box}>
        <AttachMoneyIcon />
      </Box>
      <SmallTextField variant="outlined" margin="dense" {...props} />
    </Box>
  );
}
export default CashTextField;
