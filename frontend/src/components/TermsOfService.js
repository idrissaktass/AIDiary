import React from "react";
import { Typography, Container, Box, Paper } from "@mui/material";

const TermsOfService = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
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
    </Container>
  );
};

export default TermsOfService;
