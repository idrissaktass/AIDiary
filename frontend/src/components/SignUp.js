import { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid } from '@mui/system';
import Navbar from "./Navbar";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (username.length < 6) {
      setError("Kullanıcı adı en az 6 karakter olmalı.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setError("Geçerli bir email adresi girin.");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }

    try {
      await axios.post("https://ai-diary-backend-gamma.vercel.app/api/signup", { username, email, password });
      alert("Kayıt başarılı, lütfen giriş yapın.")
      navigate("/login");
    } catch (err) {
      setError("Kayıt sırasında bir hata oluştu.");
    }
  };

  return (
    <Grid container justifyContent={"center"}>
      <Navbar />
      <Grid mt={5}>
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
          <Button variant="contained" color="primary" onClick={handleSignUp}>Kayıt Ol</Button>
          <Button color="secondary" onClick={() => navigate("/login")}>Giriş Yap</Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignUp;