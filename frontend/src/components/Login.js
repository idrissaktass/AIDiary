import { useState } from "react";
import { TextField, Button, Typography, Container, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid } from '@mui/system';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post("https://ai-diary-backend-gamma.vercel.app/api/login", { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      setError("Giriş başarısız!");
    } finally {
      setLoading(false);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Diary AI - Giriş Yap",
    "description": "Diary AI'ye giriş yaparak ruh halinizi analiz eden ve kişisel günlüklerinizi saklayan yapay zeka destekli platforma erişebilirsiniz.",
    "url": "https://diary-ai-0.vercel.app/login"
  };

  return (
      <Grid container justifyContent={"center"} minHeight={"calc(100vh - 50px)"}>
      <Helmet>
        <title>Giriş Yap - Diary AI</title>
        <meta name="description" content="Diary AI'ye giriş yaparak kişisel günlüklerinizi yönetebilir ve ruh halinizi analiz edebilirsiniz." />
        <meta name="keywords" content="Diary AI giriş, kişisel günlük, yapay zeka günlük, ruh hali analizi" />
        <meta property="og:title" content="Giriş Yap - Diary AI" />
        <meta property="og:description" content="Diary AI'ye giriş yaparak yapay zeka destekli günlük yönetim sistemine erişin." />
        <meta property="og:url" content="https://diary-ai-0.vercel.app/login" />
        <meta name="twitter:title" content="Giriş Yap - Diary AI" />
        <meta name="twitter:description" content="Diary AI'ye giriş yaparak kişisel günlüklerinizi yönetin ve analiz edin." />
        <link rel="canonical" href="https://diary-ai-0.vercel.app/login" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
      <Navbar/>
        <Grid mt={5} paddingTop={{xs:"15%", sm:"10%", md:"8%", lg:"5%"}}>
          <Typography variant="h4" gutterBottom>Giriş Yap</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          label="Kullanıcı Adı"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <TextField
          label="Şifre"
          variant="outlined"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 20 }}
        />
        <Box display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={handleLogin}>{loading ? <CircularProgress color="white" sx={{width:"22px !important", height:"22px !important"}}/> : "Giriş Yap" }</Button>
          <Button color="secondary" onClick={() => navigate("/signup")}>Kayıt Ol</Button>
        </Box>
        </Grid>
    </Grid>
  );
};

export default Login;