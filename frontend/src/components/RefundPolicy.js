import React from "react";
import { Typography, Container, Box, Paper } from "@mui/material";
import Navbar from "./Navbar";

const RefundPolicy = () => {
  return (
    <Container minHeight={"calc(100vh - 50px)"}  maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
        <Navbar/>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Refund Policy
        </Typography>
        <Typography variant="h6" gutterBottom>
          Eligibility
        </Typography>
        <Typography variant="body1" paragraph>
          To be eligible for a refund, you must request it within 30 days of
          purchase...
        </Typography>

        <Typography variant="h6" gutterBottom>
          Process
        </Typography>
        <Typography variant="body1" paragraph>
          To request a refund, please contact our support team with your
          purchase details.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Exceptions
        </Typography>
        <Typography variant="body1" paragraph>
          Certain items, such as digital downloads, are non-refundable.
        </Typography>

        {/* Add more sections here */}
      </Paper>
    </Container>
  );
};

export default RefundPolicy;
