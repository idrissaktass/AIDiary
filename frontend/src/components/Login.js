import { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid } from '@mui/system';
import Navbar from "./Navbar";
import Footer from "./Footer";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://ai-diary-backend-gamma.vercel.app/api/login", { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      setError("Giriş başarısız!");
    }
  };

  return (
    <Grid container justifyContent={"center"}>
      <Navbar/>
        <Grid mt={5}>
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
          <Button variant="contained" color="primary" onClick={handleLogin}>Giriş Yap</Button>
          <Button color="secondary" onClick={() => navigate("/signup")}>Kayıt Ol</Button>
        </Box>
        </Grid>
    </Grid>
  );
};

export default Login;