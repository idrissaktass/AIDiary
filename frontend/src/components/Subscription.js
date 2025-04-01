import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import Navbar from "./Navbar";
import { Grid } from '@mui/system';

const Subscription = () => {
  const [paddle, setPaddle] = useState(null);

  useEffect(() => {
    const loadPaddle = () => {
      if (window.Paddle) {
        window.Paddle.Setup({ vendor: 222801 }); 
        setPaddle(window.Paddle);  // Save Paddle to state
        console.log("✅ Paddle loaded successfully!");
      }
    };

    // If window.Paddle is not available, load the script
    if (!window.Paddle) {
      const script = document.createElement("script");
      script.src = "https://cdn.paddle.com/paddle/paddle.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        loadPaddle(); // Call setup when Paddle is loaded
      };

      return () => {
        document.body.removeChild(script);
      };
    } else {
      loadPaddle(); // Call again if it's already loaded
    }
  }, []); // Load only once []

  const handleCheckout = () => {
    if (paddle?.Checkout?.open) {
      paddle.Checkout.open({
        items: [{ product_id: "pro_01jqs4a9s1ez0t96evefdzhds0", quantity: 1 }], // Product ID
        vendor: 222801,
        parent_url: "https://aidiary.online/subscription",
        displayMode: "overlay",
        successCallback: (data) => {
          console.log("Payment successful:", data);
        },
        cancelCallback: (data) => {
          console.log("Payment canceled:", data);
        },
      });
    } else {
      console.error("Paddle is not loaded or the Checkout function is missing.");
    }
  };

  return (
    <Grid container direction="column" minHeight="calc(100vh - 50px)" paddingBottom={7}>
      <Navbar />
      <Grid container justifyContent="center" spacing={3} paddingTop={5}>
        {/* Free Plan */}
        <Grid item size={{ xs: 12, sm: 10, md: 4, lg: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Free Plan
              </Typography>
              <Typography>- Write a journal</Typography>
              <Typography>- Save your journals</Typography>
              <Button variant="contained" fullWidth sx={{ marginTop: 2 }}>
                Free
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Premium Plan */}
        <Grid item size={{ xs: 12, sm: 10, md: 4, lg: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Premium Plan - $6.49/month
              </Typography>
              <Typography>- Write a journal</Typography>
              <Typography>- Save your journals</Typography>
              <Typography>- Analyze your journal with AI</Typography>
              <Typography>- Save analyses</Typography>
              <Typography>- Track your happiness and stress levels</Typography>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={handleCheckout}
              >
                Buy Now
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Subscription;
