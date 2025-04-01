import React, { useState, useEffect } from "react";
import { Button, Typography, CircularProgress, Select, FormControl, MenuItem, InputLabel} from "@mui/material";
import axios from "axios";
import Navbar from "./Navbar";
import { Grid } from '@mui/system';
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { LineChart } from '@mui/x-charts/LineChart';
import useMediaQuery from "@mui/material/useMediaQuery";
import { Helmet } from "react-helmet-async";

const WeeklyAnalysis = () => {
    const [weeklyAnalysis, setWeeklyAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [canAnalyze, setCanAnalyze] = useState(true); 
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [username, setUsername] = useState(""); 
    const navigate = useNavigate();
    const [weeklyAnalyses, setWeeklyAnalyses] = useState([]);
    const [expandedAnalysis, setExpandedAnalysis] = useState(null); 
    const [loadingAnalysis, setLoadingAnalaysis] = useState(false);
    const [diaries, setDiaries] = useState([]);
    const token = localStorage.getItem("token");
    const isMedium = useMediaQuery("(max-width:1100px)");
    const isMobile = useMediaQuery("(max-width:900px)");
    const isXSMobile = useMediaQuery("(max-width:450px)");
    const [selectedGraph, setSelectedGraph] = useState("happiness");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchUserInfo(token);
            fetchWeeklyAnalyses(token);  
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const fetchWeeklyAnalyses = async (token) => {
        setLoading(true);
        try {
            const response = await axios.get("https://ai-diary-backend-gamma.vercel.app/api/weekly-analyses", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setWeeklyAnalyses(response.data);
        } catch (error) {
            console.error("Haftalık analizler alınırken hata oluştu:", error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleWeeklyAnalysis = async () => {
        setLoadingAnalaysis(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "https://ai-diary-backend-gamma.vercel.app/api/weekly-analysis",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setWeeklyAnalysis(response.data.weeklyAnalysis);
        } catch (error) {
            console.error("Error fetching weekly analysis", error);
            if (error.response && error.response.status === 400) {
                setCanAnalyze(false);
            }
        } finally {
            setLoadingAnalaysis(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/login");
    };

    const handleToggleAnalysis = (id) => {
        if (expandedAnalysis === id) {
            setExpandedAnalysis(null); 
        } else {
            setExpandedAnalysis(id); 
        }
    };

      useEffect(() => {
        const fetchDiaries = async () => {
          setLoading(true);
          try {
            const response = await axios.get("https://ai-diary-backend-gamma.vercel.app/api/diaries", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log("diaries", response.data)
            setDiaries(response.data);
          } catch (error) {
            console.error("Günlükler alınamadı:", error);
          }
          finally {
            setLoading(false); 
          }
        };
    
        fetchDiaries();
      }, [token]);
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // YYYY-MM-DD formatında
    };
    
    // Günlükleri tarihe göre sıralıyoruz
    const sortedDiaries = diaries.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // X ekseni için tarihleri alıyoruz
    const xAxisData = sortedDiaries.map(diary => formatDate(diary.date));
    
    // Mutluluk ve stres puanlarını ayrı ayrı diziye aktarıyoruz
    const happinessData = sortedDiaries.map(diary => diary.happinessScore);
    const stressData = sortedDiaries.map(diary => diary.stressScore);
    console.log("xAxisData, happinessData, stressData, sortedDiaries, diaries", xAxisData, happinessData, stressData, sortedDiaries, diaries)

    return (
        <Grid bgcolor={"#de6f1814"} minHeight={"calc(100vh - 50px)"} paddingBottom={7}>
            <Helmet>
                <title>Weekly Mood Analysis | AI Diary</title>
                <meta name="description" content="Check out the Weekly Mood Analysis page of AI Diary. Track your mood regularly and view graphs and analyses." />
                <meta name="keywords" content="weekly analysis, mood, happiness score, stress score, mood tracking, psychological analysis, artificial intelligence, AI Diary" />
                <meta property="og:title" content="Weekly Mood Analysis | AI Diary" />
                <meta property="og:description" content="Check out AI Diary's Weekly Mood Analysis page and learn how to improve your mood." />
                <meta property="og:image" content="URL_TO_IMAGE" /> {/* Add an image URL if applicable */}
                <meta property="og:url" content="https://aidiary.online/weekly-analysis" />
            </Helmet>
            <Navbar username={username} onLogout={handleLogout} />
            {loading ? (
                <Grid container justifyContent={"center"} width={"100%"} alignItems="center" mt={5} paddingTop={{xs:"15%", sm:"10%", md:"8%", lg:"5%"}}>
                    <Grid item size={{xs:12}} display={"flex"} justifyContent={"center"} alignItems="center">
                        <CircularProgress />
                    </Grid>
                </Grid> 
            ) : (
                <>
                    <Grid container size={{ xs: 12, sm: 10, md: 8 }} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} mt={5} gap={2}>
                        <Grid my={3} size={{ xs: 11.5, sm: 10, md: 8, lg: 6.5, xl: 6 }} display={"flex"} alignItems={"center"} flexDirection={"column"} padding={"25px"} bgcolor={"white"} boxShadow={"0px 5px 10px rgba(0, 0, 0, 0.16)"} borderRadius={"2px"}>
                            <Typography variant="body1" mb={2} textAlign={"start"}>
                                This page presents your score graphs and analysis of your last three entries. It takes every note you write into account to better understand your mood.
                            </Typography>
                            <Typography variant="body1" textAlign={"start"}>
                                This feature helps you track your mood regularly. Weekly analyses can assist you in understanding your mood.
                            </Typography>
                        </Grid>
                        <Typography variant="h6">Graphs</Typography>
                        {isMobile && diaries.length > 0 ? (
                            <Grid>
                                <FormControl>
                                    <InputLabel>Graph Type</InputLabel>
                                    <Select
                                        value={selectedGraph}
                                        onChange={(e) => setSelectedGraph(e.target.value)}
                                    >
                                        <MenuItem value="happiness">Happiness</MenuItem>
                                        <MenuItem value="stress">Stress</MenuItem>
                                    </Select>
                                </FormControl>
                                <Grid>
                                    <LineChart
                                        xAxis={[{ data: xAxisData, scaleType: "point" }]}
                                        yAxis={[{ min: 0, max: 10, tickValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
                                        series={[ 
                                            selectedGraph === "happiness"
                                                ? { data: happinessData, label: "Happiness Score", color: "green" }
                                                : { data: stressData, label: "Stress Score", color: "red" }
                                        ]}
                                        width={isXSMobile ? 360 : 400}
                                        height={300}
                                        alt="Happiness and Stress Score Graph"
                                    />
                                </Grid>
                            </Grid>
                        ) : diaries.length > 0 ? (
                            <Grid size={{xs:12}} display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                                <Grid>
                                    <LineChart
                                        xAxis={[{ data: xAxisData, scaleType: 'point' }]}
                                        yAxis={[{ min: 0, max: 10, tickValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
                                        series={[{ data: happinessData, label: "Happiness Score", color: "green" }]}
                                        width={isMedium ? 470 : 500}
                                        height={350}
                                        alt="Happiness Score Graph"
                                    />
                                </Grid>
                                <Grid>
                                    <LineChart
                                        xAxis={[{ data: xAxisData, scaleType: 'point' }]}
                                        yAxis={[{ min: 0, max: 10, tickValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
                                        series={[{ data: stressData, label: "Stress Score", color: "red" }]}
                                        width={isMedium ? 470 : 500}
                                        height={350}
                                        alt="Stress Score Graph"
                                    />
                                </Grid>
                            </Grid>
                        ): (
                            <Grid size = {{xs:12}} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
                                <Typography color="error" textAlign="center">Not enough entries for graphs.</Typography>
                                <Button
                                sx={{ width: "fit-content", backgroundColor: "#1764b0" }}
                                variant="contained"
                                color="primary"
                                onClick={() => handleNavigation("/home")}
                                >
                                    <Typography variant="h6">Make a Start</Typography>
                                </Button>
                            </Grid>
                        )}
                        <Button
                            sx={{ width: "fit-content", backgroundColor: "#1764b0" }}
                            variant="contained"
                            color="primary"
                            onClick={handleWeeklyAnalysis}
                            disabled={loadingAnalysis || !canAnalyze || weeklyAnalysis}
                        >
                            <Typography variant="h6">Get Weekly Analysis</Typography>
                        </Button>
                        {loadingAnalysis && <CircularProgress />}

                        {weeklyAnalysis && (
                            <Grid mt={3} mb={5} size={{ xs: 11.5, sm: 10, md: 8, lg: 6.5, xl: 6 }} display={"flex"} alignItems={"center"} flexDirection={"column"} padding={"25px"} bgcolor={"rgb(0 255 37 / 16%)"} boxShadow={"0px 5px 10px rgba(0, 0, 0, 0.16)"} borderRadius={"2px"}>
                                <Typography variant="h6" mb={2}>Weekly Mood Analysis</Typography>
                                <Typography>{weeklyAnalysis}</Typography>
                            </Grid>
                        )}
                        <Grid size={{xs:12}}>  
                            {!canAnalyze && (
                                <Typography color="error" textAlign="center">Not enough entries to perform a weekly analysis.</Typography>
                            )}
                        </Grid>
                    </Grid>
                    <Grid container justifyContent={"center"} mt={4} gap={2}>
                        <Grid size={{ xs: 11.5, sm: 10, md: 8, lg: 6.5, xl: 6 }}>
                            <Typography variant="h6">Weekly Analyses</Typography>
                        </Grid>
                        {weeklyAnalyses.length > 0 && (
                            <Grid container justifyContent={"center"} size={{xs:12}} gap={1}>
                                {weeklyAnalyses.map((analysis) => (
                                    <Grid mt={1} mb={3} size={{ xs: 11.5, sm: 10, md: 8, lg: 6.5, xl: 6 }} display={"flex"} flexDirection={"column"} padding={"20px 30px 20px 30px"} bgcolor={"white"} boxShadow={"0px 5px 10px rgba(0, 0, 0, 0.16)"} borderRadius={"2px"} item key={analysis.id} xs={12} sm={6} md={4}>
                                        <Typography variant="body2" mb={1}>{new Date(analysis.date).toLocaleDateString()}</Typography>
                                        <Typography variant="body1">{expandedAnalysis === analysis.id ? analysis.analysis : `${analysis.analysis.split(".").slice(0, 1).join(".")}...`}</Typography>
                                        <Button onClick={() => handleToggleAnalysis(analysis.id)}>
                                            {expandedAnalysis === analysis.id ? "Close" : "See Full"}
                                        </Button>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                        {!loading && weeklyAnalyses.length === 0 && (
                            <Typography>No weekly analyses have been made yet.</Typography>
                        )}
                    </Grid>
                </>
            )}
        </Grid>

    );
};

export default WeeklyAnalysis;