import { useState } from "react";
import { TextField, Button, Typography, CircularProgress, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid } from '@mui/system';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    if (username.length < 6) {
      setError("Username must be at least 6 characters.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("https://ai-diary-backend-gamma.vercel.app/api/signup", { username, email, password });
      alert("Registration successful, please log in.");
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        if (err.response.data.error === "email already exists") {
          setError("This email is already in use.");
        } else if (err.response.data.error === "username already exists") {
          setError("This username is already in use.");
        } else {
          setError(err.response.data.error);
        }
      } else {
        setError("An error occurred during registration.");
      }
    } finally {
      setLoading(false);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Diary AI - Sign Up",
    "description": "Sign up for Diary AI to manage your personal diaries and analyze your mood.",
    "url": "https://aidiary.online/signup"
  };

  return (
      <Grid container justifyContent={"center"} minHeight={"calc(100vh - 50px)"}>
      <Helmet>
        <title>Sign Up - Diary AI</title>
        <meta name="description" content="Sign up for Diary AI to join the AI-powered diary management system." />
        <meta name="keywords" content="Diary AI sign up, personal diary, AI diary, mood analysis" />
        <meta property="og:title" content="Sign Up - Diary AI" />
        <meta property="og:description" content="Sign up to manage and analyze your personal diaries with Diary AI." />
        <meta property="og:url" content="https://aidiary.online/signup" />
        <meta name="twitter:title" content="Sign Up - Diary AI" />
        <meta name="twitter:description" content="Sign up for Diary AI to start managing your mood with AI-powered diary management." />
        <link rel="canonical" href="https://aidiary.online/signup" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
        <Navbar />
        <Grid mt={5} paddingTop={{xs:"15%", sm:"10%", md:"8%", lg:"5%"}}>
          <Typography variant="h4" gutterBottom>Sign Up</Typography>
          {error && <Typography color="error" mb={2}>{error}</Typography>}
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            <Button variant="contained" color="primary" onClick={handleSignUp}>
              {loading ? <CircularProgress color="white" sx={{width:"22px !important", height:"22px !important"}} /> : "Sign Up"}
            </Button>
            <Button color="secondary" onClick={() => navigate("/login")}>Log In</Button>
          </Box>
        </Grid>
      </Grid>
  );
};

export default SignUp;
