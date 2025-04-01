import React, { useEffect } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import Navbar from "./Navbar";
import { Grid } from '@mui/system';

const Subscription = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/paddle.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.Paddle.Setup({ vendor: 222801 });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = () => {
    window.Paddle.Checkout.open({
      product: "pri_01jqs4hhg49mcxq4m10v98pf8c",
      successCallback: (data) => {
        console.log("Ödeme başarılı:", data);
      },
    });
  };

  return (
    <Grid container direction="column" minHeight="calc(100vh - 50px)" paddingBottom={7}>
      <Navbar />
      <Grid container justifyContent="center" spacing={3} paddingTop={5}>
        {/* Free Plan */}
        <Grid item size={{xs:12, sm:10, md:4, lg:3}}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Free Plan
              </Typography>
              <Typography>- Günlük yazma</Typography>
              <Typography>- Günlüklerini kaydetme</Typography>
              <Button variant="contained" fullWidth sx={{ marginTop: 2 }}>
                Ücretsiz
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Premium Plan */}
        <Grid item size={{xs:12, sm:10, md:4, lg:3}}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Premium Plan - 89,90 TL/ay
              </Typography>
              <Typography>- Günlük yazma</Typography>
              <Typography>- Günlüklerini kaydetme</Typography>
              <Typography>- Günlüğünüzü AI ile analiz etme</Typography>
              <Typography>- Analizleri kaydetme</Typography>
              <Typography>- Mutluluk ve stres durumlarınızı takip etme</Typography>
              <Button variant="contained" fullWidth color="primary" sx={{ marginTop: 2 }} onClick={handleCheckout}>
                Satın Al
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Subscription;
