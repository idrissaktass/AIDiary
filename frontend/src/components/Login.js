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
      setError("Login failed!");
    } finally {
      setLoading(false);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Diary AI - Login",
    "description": "Login to Diary AI to access the AI-powered platform that analyzes your mood and stores your personal diary.",
    "url": "https://aidiary.online/login"
  };

  return (
      <Grid container justifyContent={"center"} minHeight={"calc(100vh - 50px)"}>
      <Helmet>
        <title>Login - Diary AI</title>
        <meta name="description" content="Log in to Diary AI to manage your personal diary and analyze your mood." />
        <meta name="keywords" content="Diary AI login, personal diary, AI diary, mood analysis" />
        <meta property="og:title" content="Login - Diary AI" />
        <meta property="og:description" content="Log in to access the AI-powered diary management system." />
        <meta property="og:url" content="https://aidiary.online/login" />
        <meta name="twitter:title" content="Login - Diary AI" />
        <meta name="twitter:description" content="Log in to manage and analyze your personal diary with Diary AI." />
        <link rel="canonical" href="https://aidiary.online/login" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
      <Navbar/>
        <Grid mt={5} paddingTop={{xs:"15%", sm:"10%", md:"8%", lg:"5%"}}>
          <Typography variant="h4" gutterBottom>Login</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 20 }}
        />
        <Box display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={handleLogin}>{loading ? <CircularProgress color="white" sx={{width:"22px !important", height:"22px !important"}}/> : "Login" }</Button>
          <Button color="secondary" onClick={() => navigate("/signup")}>Sign Up</Button>
        </Box>
        </Grid>
    </Grid>
  );
};

export default Login;
