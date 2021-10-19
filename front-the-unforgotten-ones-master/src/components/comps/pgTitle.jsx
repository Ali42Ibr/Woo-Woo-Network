import React from 'react';
import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import globalStyles from './globalStyling.module.css';

const useStyles = makeStyles((theme) => ({}));

function PageTitle(props) {
  const classes = useStyles();

  return (
    <Box className={`${classes.Typography} ${globalStyles.pageTitle}`}>
      <Typography variant="h4" {...props}>
        {props.contents}
      </Typography>
    </Box>
  );
}
export default PageTitle;
