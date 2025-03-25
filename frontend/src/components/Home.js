import { useEffect, useState } from "react";
import DiaryEntry from "./DiaryEntry";
import DiaryList from "./DiaryList";
import Login from "./Login";
import { Container, CircularProgress, Button, Drawer } from "@mui/material";
import { Link } from "react-router-dom";
import { Grid } from '@mui/system';
import Navbar from "./Navbar"; 
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";

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
    return (
        <Grid container justifyContent={"center"} width={"100%"} minHeight={"100vh"}>
            {isLoggedIn && (
                <Navbar 
                onLogout={handleLogout} 
                onNewDiary={handleNewDiary} 
                onToggleDrawer={toggleDrawer} 
                drawerOpen={drawerOpen} 
                username={username}
                />
            )}

            {isLoggedIn ? (
                <Grid container justifyContent={{xs:"center", sm:"center", md:"start", lg:"center"}} width={"100%"}>
                    <Grid size={{xs:12, sm:11, md:8.5, lg:8.5}} display={"flex"} justifyContent={"center"} paddingTop={{xs:"12%", sm:"10%", md:"8%", lg:"5%"}}>
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
                    },
                    }}
                    variant="persistent"
                    anchor="right"
                    open={drawerOpen || !matches} 
                >
                    {loadingEntries ? (
                        <Grid container justifyContent="center" alignItems="center" style={{ height: "100%" }}>
                            <CircularProgress />
                        </Grid>
                    ) : (
                        <DiaryList handleDiaryClick={handleDiaryClick} entries={entries} />
                    )}
                </Drawer>

                </Grid>
            ) : (
                <Login onLogin={() => setIsLoggedIn(true)} />
            )}
        </Grid>
    );
};

export default Home;
