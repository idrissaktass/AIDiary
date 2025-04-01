import React, { useEffect } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import Navbar from "./Navbar";
import { Grid } from '@mui/system';

const Subscription = () => {
  console.log("paddle",window.Paddle.Environment);
  useEffect(() => {
    const loadPaddle = () => {
      if (window.Paddle) {
        window.Paddle.Setup({ vendor: 222801 }); 
        console.log("✅ Paddle başarıyla yüklendi!");
      }
    };
  
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
  }, []);
  
  
  console.log(window.Paddle);


  const handleCheckout = () => {
    if (!window.Paddle) {
      console.error("Paddle yüklenmedi veya `Setup` çalıştırılmadı.");
      return;
    }
  
    window.Paddle.Checkout.open({
      items: [{ priceId: "pri_01jqs4hhg49mcxq4m10v98pf8c", quantity: 1 }], // ✅ Doğru format!
      settings: {
        displayMode: "overlay",
        parentUrl: "https://aidiary.online/subscription"
      },
      successCallback: (data) => {
        console.log("✅ Ödeme başarılı:", data);
      },
      cancelCallback: (data) => {
        console.log("❌ Ödeme iptal edildi:", data);
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
