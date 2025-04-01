import { useEffect, useState } from "react";
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
            console.error("Kullanıcı bilgisi alınırken hata oluştu:", error);
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
        } finally {
            setLoadingEntries(false); 
        }
    };
    

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/login");
    };

    const toggleDrawer = (open) => {
        setDrawerOpen(open);
    };

    const handleDiaryClick = (entry) => {
        setSelectedDiary(entry);
        setDrawerOpen(false);
    };

    const handleNewDiary = () => {
        setSelectedDiary(null); 
        navigate("/home")
    };

    if (isLoggedIn === null) {
        return (
        <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <CircularProgress />
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
                <title>Diary AI - Yapay Zeka Destekli Günlük Uygulaması</title>
                <meta name="description" content="Diary AI, yapay zeka ile günlüklerinizi analiz eden ve size özel öneriler sunan kişisel bir günlük uygulamasıdır." />
                <meta name="keywords" content="Diary AI, kişisel günlük, yapay zeka, ruh hali analizi, günlük tutma uygulaması" />
                <meta property="og:title" content="Diary AI - Yapay Zeka Destekli Günlük Uygulaması" />
                <meta property="og:description" content="Diary AI, günlüklerinizi analiz eden ve size özel öneriler sunan akıllı bir günlük tutma uygulamasıdır." />
                <meta property="og:image" content="https://aidiary.online/preview-image.jpg" />
                <meta property="og:url" content="https://aidiary.online/home" />
                <meta name="twitter:title" content="Diary AI - Yapay Zeka Destekli Günlük Uygulaması" />
                <meta name="twitter:description" content="Günlüklerinizi yapay zeka ile analiz edin ve daha bilinçli bir yaşam sürün!" />
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
                />

                <Grid container justifyContent={{xs:"center", sm:"center", md:"start", lg:"center"}} width={"100%"}>
                    <Grid size={{xs:12, sm:11, md:8.5, lg:8.5}} display={"flex"} justifyContent={"center"} paddingTop={{xs:"15%", sm:"10%", md:"8%", lg:"5%"}}>
                        {selectedDiary ? (
                            <DiaryEntry token={localStorage.getItem("token")} selectedDiary={selectedDiary} />
                        ) : (
                            <DiaryEntry token={localStorage.getItem("token")} handleDiarySave={handleDiarySave} /> 
                        )}
                </Grid>
                    <Drawer
                    sx={{
                    zIndex:"0",
                    width: mdScreen ? 300 : 350,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        boxShadow:"0px 5px 10px rgba(0, 0, 0, 0.16)",
                        width: mdScreen ? 300 : 350,
                        boxSizing: 'border-box',
                        display:  "block", 
                        position: "absolute",
                        display: (matches && !drawerOpen) ? "none" : "unset"
                    },
                    }}
                    variant="persistent"
                    anchor="right"
                    open={drawerOpen || !matches} 
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
                        >
                            <Typography sx={{backgroundColor:"#ad1f1f", padding:"1px 5px 1px 5px", borderRadius:"3px"}} fontSize={"15px"} color={"white"}>X</Typography>
                        </Button>
                    )}
                    {loadingEntries ? (
                        <Grid container justifyContent="center" alignItems="center" style={{ height: "100%" }}>
                            <CircularProgress />
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
