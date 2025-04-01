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
        setPaddle(window.Paddle);  // Paddle'ı state'e kaydet
        console.log("✅ Paddle başarıyla yüklendi!");
      }
    };

    // Eğer window.Paddle mevcut değilse, script'i yükle
    if (!window.Paddle) {
      const script = document.createElement("script");
      script.src = "https://cdn.paddle.com/paddle/paddle.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        loadPaddle(); // Paddle yüklendiğinde setup çağrılacak
      };

      return () => {
        document.body.removeChild(script);
      };
    } else {
      loadPaddle(); // Zaten yüklenmişse tekrar çağır
    }
  }, []); // sadece bir kez yüklemek için []

  const handleCheckout = () => {
    if (paddle?.Checkout?.open) {
      paddle.Checkout.open({
        items: [{ product_id: "pro_01jqs4a9s1ez0t96evefdzhds0", quantity: 1 }], // Product ID
        vendor: 222801,
        parent_url: "https://aidiary.online/subscription",
        displayMode: "overlay",
        successCallback: (data) => {
          console.log("Ödeme başarılı:", data);
        },
        cancelCallback: (data) => {
          console.log("Ödeme iptal edildi:", data);
        },
      });
    } else {
      console.error("Paddle yüklenmedi veya Checkout fonksiyonu bulunamadı.");
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
              <Typography>- Günlük yazma</Typography>
              <Typography>- Günlüklerini kaydetme</Typography>
              <Button variant="contained" fullWidth sx={{ marginTop: 2 }}>
                Ücretsiz
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Premium Plan */}
        <Grid item size={{ xs: 12, sm: 10, md: 4, lg: 3 }}>
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
              <Button
                variant="contained"
                fullWidth
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={handleCheckout}
              >
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
