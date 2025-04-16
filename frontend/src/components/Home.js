import { useEffect, useState, useCallback } from "react";
import DiaryEntry from "./DiaryEntry";
import DiaryList from "./DiaryList";
import Login from "./Login";
import { Container, CircularProgress, Button, Drawer, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Grid } from '@mui/system';
import Navbar from "./Navbar"; 
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedDiary, setSelectedDiary] = useState(null);
    const matches = useMediaQuery('(max-width:900px)');
    const mdScreen = useMediaQuery('(min-width:900px) and (max-width:1200px)');
    const navigate = useNavigate();
    const [username, setUsername] = useState(""); 
    const [entries, setEntries] = useState([]);
    const [loadingEntries, setLoadingEntries] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchEntries(token);
            fetchUserInfo(token);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const fetchUserInfo = async (token) => {
        try {
            const response = await fetch("https://ai-diary-backend-gamma.vercel.app/api/user", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setUsername(data.username);
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setIsLoggedIn(false);
        }
    };

    const fetchEntries = async (token) => {
        console.log(localStorage.getItem("token"));
        setLoadingEntries(true); 
        try {
            const res = await axios.get("https://ai-diary-backend-gamma.vercel.app/api/diaries", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (res.data && res.data.length > 0) {
                setEntries(res.data);
            } else {
                setEntries([]);
            }
        } catch (error) {
            console.error("Error fetching diary entries:", error);
            alert("Something went wrong while fetching diary entries. Please try again later.");
        } finally {
            setLoadingEntries(false); 
        }
    };
    

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
    };

    const toggleDrawer = (open) => {
        setDrawerOpen(open);
    };

    const handleDiaryClick = useCallback((entry) => {
        setSelectedDiary(entry);
        setDrawerOpen(false);
    }, []);   

    const handleNewDiary = () => {
        setSelectedDiary(null); 
        navigate("/home")
    };

    if (isLoggedIn === null) {
        return (
        <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <CircularProgress aria-live="polite" />
        </Container>
        );
    }

    const handleDiarySave = (newDiary) => {
        setEntries((prevEntries) => [newDiary, ...prevEntries]);
        fetchEntries(localStorage.getItem("token"));
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Diary AI - Kişisel Günlük Uygulaması",
        "description": "Diary AI, yapay zeka destekli kişisel günlük tutma uygulamasıdır. Ruh halinizi analiz eder, öneriler sunar ve geçmiş kayıtlarınızı yönetmenize yardımcı olur.",
        "url": "https://aidiary.online/home",
        "image": "https://aidiary.online/preview-image.jpg"
    };

    return (
        <Grid container justifyContent={"center"} width={"100%"} minHeight={"calc(100vh - 50px)"}>
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
                <link rel="canonical" href="https://aidiary.online/home" />
                <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
            </Helmet>

            <Navbar 
                onLogout={handleLogout} 
                onNewDiary={handleNewDiary} 
                onToggleDrawer={toggleDrawer} 
                drawerOpen={drawerOpen} 
                username={username}
                aria-label="Open Navigation Drawer"
            />

            <Grid container justifyContent={{xs:"center", sm:"center", md:"start", lg:"center"}} width={"100%"}>
                {/* <Button 
                    onClick={() => window.open("https://buymeacoffee.com/aidiary", "_blank")}
                    sx={{
                        mt: {xs:"80px", md:"unset"},
                        position: {xs:"unset", md:'absolute'}, 
                        top: "80px", 
                        left: '20px', 
                        zIndex: 1000,
                        padding: '5px 10px 5px 10px',
                        backgroundColor: '#ffdd00',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer'
                    }}>
                        <img src="/coffee-icon.png" width={"25px"} height={"auto"}/>
                        <Typography className="coffee" sx={{ color: 'black', fontFamily: "'Cookie', cursive", textTransform:"lowercase" ,fontWeight: "450", fontSize:{xs:"18px", lg:"22px"} }}>
                        buy me a coffee
                        </Typography>
                </Button> */}
                <Grid size={{xs:12, sm:11, md:8.5, lg:8.5}} display={"flex"} justifyContent={"center"} paddingTop={{xs:"0%", md:"8%", lg:"5%"}}>
                    {selectedDiary ? (
                        <DiaryEntry token={localStorage.getItem("token")} selectedDiary={selectedDiary} />
                    ) : (
                        <DiaryEntry token={localStorage.getItem("token")} handleDiarySave={handleDiarySave} /> 
                    )}
                </Grid>

                <Drawer
                    sx={{
                        zIndex: "0",
                        width: mdScreen ? 300 : 350,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.16)",
                            width: mdScreen ? 300 : 350,
                            boxSizing: 'border-box',
                            display: "block", 
                            position: "absolute",
                            display: (matches && !drawerOpen) ? "none" : "unset"
                        },
                    }}
                    variant="persistent"
                    anchor="right"
                    open={drawerOpen || !matches} 
                    aria-labelledby="diary-list-drawer"
                >
                    {matches && (
                        <Button
                            onClick={handleDrawerClose}
                            sx={{
                                position: "absolute",
                                top: "70px",
                                right: "-15px",
                                backgroundColor: "transparent",
                                border: "none",
                                cursor: "pointer",
                            }}
                            aria-label="Close drawer"
                        >
                            <Typography sx={{backgroundColor:"#ad1f1f", padding:"1px 5px 1px 5px", borderRadius:"3px"}} fontSize={"15px"} color={"white"}>X</Typography>
                        </Button>
                    )}
                    {loadingEntries ? (
                        <Grid container justifyContent="center" alignItems="center" style={{ height: "100%" }}>
                            <CircularProgress aria-live="polite" />
                        </Grid>
                    ) : (
                        <DiaryList handleDiaryClick={handleDiaryClick} entries={entries} />
                    )}
                </Drawer>
            </Grid>
        </Grid>
    );
};

export default Home;
