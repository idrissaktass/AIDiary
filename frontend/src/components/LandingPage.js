import { Typography, TextField, Button, Container, CircularProgress, AppBar, Toolbar  } from "@mui/material";
import React, {useState} from "react";
import { Box, Grid, height } from '@mui/system';
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Features from "./Features"
import Footer from "./Footer";
import { keyframes } from '@emotion/react';
import axios from "axios";
import "./LandingPage.css";

const generateStars = (count = 30) => {
    const colors = ["#ffe066", "#ffd6e0", "#c5f6fa", "red", "blue", "orange", "green"];
    const stars = [];
  
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 15 + 10; // 10px - 25px
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const duration = Math.random() * 3 + 2;
      const color = colors[Math.floor(Math.random() * colors.length)];
  
      stars.push(
        <svg
          key={i}
          className="star"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDuration: `${duration}s`,
            fill: "yellow",
          }}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l2.9 6.1L22 9.3l-5 4.9L18.2 22 12 18.4 5.8 22l1-7.8-5-4.9 7.1-1.2z" />
        </svg>
      );
    }
  
    return stars;
  };
  
const LandingPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
  
    const handleFeatures = () => {
        window.scrollTo({
            top: window.innerHeight - 50,
            behavior: "smooth"
        });
    };
    
    const handleHome = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


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
          navigate("/");
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
        "name": "Diary AI - AI-Powered Diary Application",
        "description": "Diary AI is an AI-powered personal diary app that helps you track your mood and analyze your daily thoughts.",
        "url": "https://aidiary.online",
        "image": "https://aidiary.online/preview-image.jpg"
    };
    return(
        <>
            <Helmet>
                <title>Diary AI - AI-Powered Diary Application</title>
                <meta name="description" content="Analyze your mood and manage your personal diary with AI using Diary AI." />
                <meta name="keywords" content="Diary AI, AI diary, personal diary, mood tracking, mood analysis, diary, ai diary, diary ai, ai, diary, journal" />
                <meta property="og:title" content="Diary AI - AI-Powered Diary Application" />
                <meta property="og:description" content="Analyze your diaries with AI and track your mood!" />
                <meta property="og:image" content="https://aidiary.online/preview-image.jpg" />
                <meta property="og:url" content="https://aidiary.online" />
                <meta name="twitter:title" content="Diary AI - AI-Powered Diary Application" />
                <meta name="twitter:description" content="Analyze your mood, manage your personal diary!" />
                <meta name="twitter:image" content="https://aidiary.online/preview-image.jpg" />
                <link rel="canonical" href="https://aidiary.online" />
                <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
            </Helmet>
            <AppBar sx={{background:"linear-gradient(to right,rgb(10, 19, 31), #294d71, #101e2d)", boxShadow:"none"}}>
                <Toolbar sx={{display:"flex", color:"white", justifyContent:"space-between", paddingBlock:"2px", width:"80%", alignSelf:"center"}}>
                    <Typography color="#de7618" fontSize={"26px"} fontWeight={"700"}>DIARY AI</Typography>
                    <Grid display={"flex"} gap={"20px"}>
                        <Typography onClick={handleHome} sx={{cursor:"pointer"}}>HOME</Typography>
                        <Typography onClick={handleFeatures} sx={{cursor:"pointer"}}>FEATURES</Typography>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Grid minHeight={"100vh"} bgcolor={"white"}>
                <Grid height={{xs:"65vh", sm:"100vh"}} position={"relative"}>
                    <Box component={"img"} src="/assets/meditate.jpg" alt="diary-ai" width={"100%"} height={"100%"} sx={{ objectFit: "cover" }}  position={"absolute"} top={0}/>
                </Grid>
                <Grid container width={"100%"} alignItems={"center"} minHeight={"97%"} color={"white"} justifyContent={{xs:"space-around", sm:"center", md:"space-around"}} padding={{xs:"10px", lg:"50px", xl:"100px"}}
                    position="absolute"
                    top={0}
                    left={0}
                    zIndex={1}>
                        <Grid size={{xs:12, md:5.5}} textAlign={"start"} mt={{xs:0, sm:5, md:0}} height={{xs:"40vh", sm:"unset"}} alignItems={{xs:"end", sm:"center"}} display={"flex"}>
                            <Grid position={"relative"} display={"flex"} flexDirection={"column"} width={{xs:"100%", lg:"80%"}} gap={{xs:"20px", sm:3}} padding={{xs:"0px", sm:"30px"}} alignItems={"center"} justifyContent={"center"}>
                            <Box
                                position="absolute"
                                top={0}
                                left={0}
                                width="100%"
                                height="100%"
                                zIndex={1}
                                sx={{ pointerEvents: "none" }}
                            >
                                {generateStars(20)}
                            </Box>
                            <Typography width={"100%"} fontWeight={"600"} textAlign={"start"} fontSize={{xs:"30px", sm:"60px"}} lineHeight={{xs:"40px", sm:"75px"}} fontFamily={"var(--nerf-heading-font)"}>
                                CREATE YOUR SAFE SPACE
                            </Typography>
                            <Typography  fontSize={{xs:"18px", sm:"22px"}} lineHeight={"30px"}>
                                Understand your mood better and track your mental state with Diary AI.
                            </Typography>
                            {/* <Button variant="contained" color="secondary" sx={{width:"fit-content"}}  onClick={() => navigate("/home")}>
                                <Typography variant="h5">
                                    Start Sharing
                                </Typography>
                            </Button> */}
                            </Grid>
                        </Grid>
                        <Grid size={{xs:12, md:5.5}} display={"flex"} justifyContent={"end"} mt={{xs:0, sm:20, md:0}}>
                            {isSignUp === false ? (
                                <Grid bgcolor={"white"} p={"25px"} width={{xs:"100%", sm:"60%", md:"75%"}} borderRadius={"10px"} boxShadow={"0px 5px 10px #80808087"}>
                                    <Typography fontSize={{xs:"26px", sm:"34px"}} color="#de7618" mb={3}>Login, free for now.</Typography>
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
                                    <Button variant="contained" color="primary" sx={{backgroundColor:"#de7618"}}  onClick={handleLogin}>{loading ? <CircularProgress color="white" sx={{width:"22px !important", height:"22px !important"}}/> : "Login" }</Button>
                                    <Button color="secondary" onClick={() => { setIsSignUp(true); }}>Sign Up</Button>
                                    </Box>
                                </Grid>
                            ) : (
                                <Grid bgcolor={"white"} p={"25px"} width={{xs:"100%", sm:"60%", md:"75%"}} borderRadius={"10px"} boxShadow={"0px 5px 10px #80808087"}>
                                    <Typography fontSize={{xs:"26px", sm:"34px"}} color="#de7618" mb={3}>Sign Up</Typography>
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
                                    <Button color="secondary" onClick={() => {setIsSignUp(false); }}>Log In</Button>
                                    </Box>
                                </Grid>    
                            )}
                    </Grid>
                </Grid>
            </Grid>
            <Features/>
            <Footer/>
        </>
    );
}

export default LandingPage;
