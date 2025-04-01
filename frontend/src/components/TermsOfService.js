import React from "react";
import { Typography, Container, Box, Paper } from "@mui/material";
import Navbar from "./Navbar";
import { Grid } from '@mui/system';

const TermsOfService = () => {
  return (
    <Grid container minHeight={"calc(100vh - 50px)"} maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
        <Navbar/>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Terms of Service
        </Typography>
        <Typography variant="h6" gutterBottom>
          Introduction
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to our website. These terms and conditions outline the rules
          and regulations for the use of our services.
        </Typography>

        <Typography variant="h6" gutterBottom>
          User Responsibilities
        </Typography>
        <Typography variant="body1" paragraph>
          By using this site, you agree to follow the terms outlined here...
        </Typography>

        <Typography variant="h6" gutterBottom>
          Account Termination
        </Typography>
        <Typography variant="body1" paragraph>
          We reserve the right to suspend or terminate your account if you
          violate any terms.
        </Typography>

        {/* Add more sections here */}
      </Paper>
    </Grid>
  );
};

export default TermsOfService;
