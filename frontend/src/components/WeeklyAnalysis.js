import React, { useState, useEffect } from "react";
import { Button, Typography, CircularProgress} from "@mui/material";
import axios from "axios";
import Navbar from "./Navbar";
import { Grid } from '@mui/system';
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { LineChart } from '@mui/x-charts/LineChart';

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
    console.log("xAxisData, happinessData, stressData", xAxisData, happinessData, stressData)

    return (
        <Grid bgcolor={"#de6f1814"} minHeight={"calc(100vh - 50px)"} paddingBottom={7}>
            <Navbar username={username} onLogout={handleLogout} />
            <Grid container size={{ xs: 12, sm: 10, md: 8 }} display={"flex"} flexDirection={"column"} alignItems={"center"} mt={5} gap={2}>
            <Grid size={{xs:12}}>
                <Typography variant="h6">Mutluluk Puanı</Typography>
                <LineChart
                    xAxis={[{ data: xAxisData, scaleType: 'point' }]}
                    series={[{ data: happinessData, label: "Mutluluk Skoru", color: "green" }]}
                    width={500}
                    height={300}
                />

                <Typography variant="h6">Stres Puanı</Typography>
                <LineChart
                    xAxis={[{ data: xAxisData, scaleType: 'point' }]}
                    series={[{ data: stressData, label: "Stres Skoru", color: "red" }]}
                    width={500}
                    height={300}
                />
            </Grid>
                <Grid my={3} size={{ xs: 11.5, sm: 10, md: 8, lg: 6.5, xl: 6 }} display={"flex"} alignItems={"center"} flexDirection={"column"} padding={"25px"} bgcolor={"white"} boxShadow={"0px 5px 10px rgba(0, 0, 0, 0.16)"} borderRadius={"2px"}>
                    <Typography variant="body1" mb={2} textAlign={"start"}>
                        Bu sayfa, son üç girişinizin analizini sunar. Ruh halinizi daha iyi anlayabilmek için yazdığınız her notu dikkate alır.
                    </Typography>
                    <Typography variant="body1" textAlign={"start"}>
                        Bu özellik, ruh halinizi düzenli olarak takip etmenizi sağlar. Haftalık analizler, duygu durumunuzu anlamada yardımcı olabilir.
                    </Typography>
                </Grid>
                <Button
                    sx={{ width: "fit-content", backgroundColor: "#1764b0" }}
                    variant="contained"
                    color="primary"
                    onClick={handleWeeklyAnalysis}
                    disabled={loadingAnalysis || !canAnalyze || weeklyAnalysis}
                >
                    <Typography variant="h6">Haftalık Analizi Al</Typography>
                </Button>
                {loadingAnalysis && <CircularProgress />}

                {weeklyAnalysis && (
                    <Grid mt={3} mb={5} size={{ xs: 11.5, sm: 10, md: 8, lg: 6.5, xl: 6 }} display={"flex"} alignItems={"center"} flexDirection={"column"} padding={"25px"} bgcolor={"rgb(0 255 37 / 16%)"} boxShadow={"0px 5px 10px rgba(0, 0, 0, 0.16)"} borderRadius={"2px"}>
                        <Typography variant="h6" mb={2}>Haftalık Ruh Hali Analizi</Typography>
                        <Typography>{weeklyAnalysis}</Typography>
                    </Grid>
                )}
            </Grid>
            <Grid container justifyContent={"center"} mt={4} gap={2}>
                <Grid size={{ xs: 11.5, sm: 10, md: 8, lg: 6.5, xl: 6 }}>
                  <Typography variant="h6">Haftalık Analizler</Typography>
                </Grid>
                <Grid size={{xs:12}}>  
                    {!canAnalyze && (
                        <Typography color="error">Haftalık analiz için yeterli giriş yapılmadı.</Typography>
                    )}
                </Grid>
                {loading ? (
                    <Grid container justifyContent={"center"} width={"100%"}>
                        <Grid item size={{xs:12}} display={"flex"} justifyContent={"center"}>
                            <CircularProgress />
                        </Grid>
                    </Grid>
                ) : (
                    weeklyAnalyses.length > 0 && (
                        <Grid container justifyContent={"center"} size={{xs:12}} gap={1}>
                            {weeklyAnalyses.map((analysis) => (
                                <Grid mt={1} mb={3} size={{ xs: 11.5, sm: 10, md: 8, lg: 6.5, xl: 6 }} display={"flex"} flexDirection={"column"} padding={"20px 30px 20px 30px"} bgcolor={"white"} boxShadow={"0px 5px 10px rgba(0, 0, 0, 0.16)"} borderRadius={"2px"} item key={analysis.id} xs={12} sm={6} md={4}>
                                    <Typography variant="body2" mb={1}>{new Date(analysis.date).toLocaleDateString()}</Typography>
                                    <Typography variant="body1">{expandedAnalysis === analysis.id ? analysis.analysis : `${analysis.analysis.split(".").slice(0, 1).join(".")}...`}</Typography>
                                    <Button onClick={() => handleToggleAnalysis(analysis.id)}>
                                        {expandedAnalysis === analysis.id ? "Kapat" : "Tamamını Gör"}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    )
                )}
                {!loading && weeklyAnalyses.length === 0 && (
                    <Typography>Henüz haftalık analiz yapılmamış.</Typography>
                )}
            </Grid>
        </Grid>
    );
};

export default WeeklyAnalysis;