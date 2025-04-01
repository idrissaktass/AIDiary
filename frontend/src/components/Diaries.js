import React, { useState, useEffect } from "react";
import { Button, Typography, Box , CircularProgress } from "@mui/material";
import axios from "axios";
import { Grid } from '@mui/system';
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";

const MemoizedDiaries = React.memo(({ diaries }) => (
  <>
    {diaries.map((diary) => (
            <Grid size={{ xs: 11.5, sm: 10, md: 8 }}
            key={diary._id}
            sx={{
              border: "1px solid gray",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px", 
            }}
          >
            <Typography fontSize={"18px"}>{new Date(diary.date).toLocaleDateString()}</Typography>

            <Typography fontSize={"16px"} my={2}>
              {diary.text}
            </Typography>

            <Box
              sx={{
                backgroundColor: "#8000000a",
                padding: "20px",
                marginTop: "20px",
                borderRadius: "8px",
                fontSize: "18px",
              }}
            >
              {diary.mood ? (
                diary.mood
              ) : (
                <Typography variant="body1" color="gray">
                  Analiz yok.
                </Typography>
              )}
            </Box>
          </Grid>
    ))}
  </>
));

const Diaries = () => {
  const [diaries, setDiaries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentDiaries, setCurrentDiaries] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const diariesPerPage = 5; 
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [username, setUsername] = useState(""); 

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
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
        setTotalPages(Math.ceil(response.data.length / diariesPerPage)); 
      } catch (error) {
        console.error("Günlükler alınamadı:", error);
      }
      finally {
        setLoading(false); 
      }
    };

    fetchDiaries();
  }, [token]);

  useEffect(() => {
    const indexOfLastDiary = currentPage * diariesPerPage;
    const indexOfFirstDiary = indexOfLastDiary - diariesPerPage;
    setCurrentDiaries(diaries.slice(indexOfFirstDiary, indexOfLastDiary)); 
  }, [currentPage, diaries]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
};

  return (
    <Grid  minHeight={"calc(100vh - 50px)"} paddingBottom={7}>
      <Helmet>
        <title>Günlüklerim - AI Diary</title>
        <meta name="description" content="Yapay zeka destekli günlüklerinizi görüntüleyin ve analizleri keşfedin." />
        <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Günlüklerim - AI Diary",
            "description": "Yapay zeka destekli günlüklerinizi görüntüleyin ve analizleri keşfedin.",
            "author": {
                "@type": "Person",
                "name": username
            },
            "datePublished": new Date().toISOString(),
            "url": window.location.href
        })}
        </script>
      </Helmet>
    <Navbar username={username} onLogout={handleLogout} />
      {loading ? (
        <Grid container justifyContent={"center"} width={"100%"} alignItems="center" mt={5}  paddingTop={{xs:"15%", sm:"10%", md:"8%", lg:"5%"}}>
            <Grid item size={{xs:12}} display={"flex"} justifyContent={"center"} alignItems="center">
                <CircularProgress />
            </Grid>
        </Grid> 
      ) : (
        <Grid container spacing={3} direction="column" alignItems="center" py={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          Günlüklerim
        </Typography>
        <Helmet>
            <title>Günlüklerim - AI Diary</title>
            <meta name="description" content="Yapay zeka destekli günlüklerinizi görüntüleyin ve analizleri keşfedin." />
            <meta name="keywords" content="günlük, yapay zeka, duygu analizi, kişisel gelişim, AI diary, günlük analizi, günlük yazma" />
        </Helmet>
          
        {currentDiaries.length > 0 ? (
          <MemoizedDiaries diaries={currentDiaries} />
        ) : (
          <Typography fontSize={"18px"}>Henüz kaydınız yok.</Typography>
        )}
  
        {/* Sayfalama */}
        {totalPages > 1 && (
          <Grid display={"flex"} alignItems={"center"}>
            <Button
              variant="contained"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Önceki
            </Button>
            <Typography fontSize={"16px"} sx={{ margin: "0 10px" }}>
              {currentPage} / {totalPages}
            </Typography>
            <Button
              variant="contained"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sonraki
            </Button>
          </Grid>
        )}
      </Grid>
      )}
  </Grid>
  );
};

export default Diaries;
