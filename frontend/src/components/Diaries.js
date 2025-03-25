import React, { useState, useEffect } from "react";
import { Button, Typography, Box , CircularProgress } from "@mui/material";
import axios from "axios";
import { Grid } from '@mui/system';
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

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
    <Grid  minHeight={"calc(100vh - 60px)"} paddingBottom={7}>
    <Navbar username={username} onLogout={handleLogout} />
    <Grid container spacing={3} direction="column" alignItems="center" py={5}>
      <Typography variant="h4" gutterBottom>
        Günlüklerim
      </Typography>

      {/* Loading Spinner */}
      {loading ? (
        <CircularProgress />
      ) : currentDiaries.length > 0 ? (
        currentDiaries.map((diary) => (
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
        ))
      ) : (
        <Typography fontSize={"18px"}>Henüz kaydınız yok.</Typography>
      )}

      {/* Sayfalama */}
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
    </Grid>
  </Grid>
  );
};

export default Diaries;
