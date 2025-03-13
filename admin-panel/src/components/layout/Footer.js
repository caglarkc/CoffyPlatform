import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        {'© '}
        <Link color="inherit" href="https://coffy.com/" target="_blank">
          Coffy
        </Link>{' '}
        {currentYear}
        {' - Tüm Hakları Saklıdır'}
      </Typography>
    </Box>
  );
};

export default Footer;
