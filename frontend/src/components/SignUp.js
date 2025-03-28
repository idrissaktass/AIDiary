import { useState } from "react";
import { TextField, Button, Typography, CircularProgress, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid } from '@mui/system';
import Navbar from "./Navbar";
import Footer from "./Footer";

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
      setError("Kullanıcı adı en az 6 karakter olmalı.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setError("Geçerli bir email adresi girin.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("https://ai-diary-backend-gamma.vercel.app/api/signup", { username, email, password });
      alert("Kayıt başarılı, lütfen giriş yapın.")
      navigate("/login");
    }  catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        if (err.response.data.error === "email zaten var") {
          setError("Bu email zaten kullanılıyor.");
        } else if (err.response.data.error === "username zaten var") {
          setError("Bu kullanıcı adı zaten kullanılıyor.");
        }
         else {
          setError(err.response.data.error);
        }
      } else {
        setError("Kayıt sırasında bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container justifyContent={"center"}  minHeight={"calc(100vh - 50px)"}>
      <Navbar />
      <Grid mt={5} paddingTop={{xs:"15%", sm:"10%", md:"8%", lg:"5%"}}>
        <Typography variant="h4" gutterBottom>Kayıt Ol</Typography>
        {error && <Typography color="error" mb={2}>{error}</Typography>}
        <TextField
          label="Kullanıcı Adı"
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
          label="Şifre"
          variant="outlined"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 20 }}
        />
        <Box display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={handleSignUp}>{loading ? <CircularProgress color="white" sx={{width:"22px !important", height:"22px !important"}}/> : "Kayıt Ol" }</Button>
          <Button color="secondary" onClick={() => navigate("/login")}>Giriş Yap</Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignUp;