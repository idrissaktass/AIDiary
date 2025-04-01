import React from "react";
import { Typography, Container, Box, Paper } from "@mui/material";
import Navbar from "./Navbar";
import { Grid } from '@mui/system';

const PrivacyPolicy = () => {
  return (
    <Grid container minHeight={"calc(100vh - 50px)"} maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
        <Navbar/>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="h6" gutterBottom>
          Information Collection
        </Typography>
        <Typography variant="body1" paragraph>
          We collect personal data such as name, email, and payment details...
        </Typography>

        <Typography variant="h6" gutterBottom>
          How We Use Information
        </Typography>
        <Typography variant="body1" paragraph>
          The information we collect is used to improve our service and
          communicate with you.
        </Typography>

        <Typography variant="h6" gutterBottom>
          User Rights
        </Typography>
        <Typography variant="body1" paragraph>
          You have the right to access, update, or delete your personal data.
        </Typography>

        {/* Add more sections here */}
      </Paper>
    </Grid>
  );
};

export default PrivacyPolicy;
