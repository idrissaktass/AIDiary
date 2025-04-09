import React, { useState, useEffect } from "react";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { Grid } from '@mui/system';
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";
import { Skeleton } from "@mui/material";

const MemoizedDiarySkeletons = React.memo(({ count }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <Grid
        key={index}
        size={{ xs: 11.5, sm: 10, md: 8 }}
        sx={{
          border: "1px solid gray",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
          minHeight: "120px",
        }}
      >
        <Skeleton variant="text" width="40%" height={30} />
        <Skeleton variant="text" width="100%" height={60} sx={{ my: 2 }} />
        <Skeleton
          variant="rectangular"
          height={80}
          sx={{
            borderRadius: "8px",
            marginTop: "20px",
          }}
        />
      </Grid>
    ))}
  </>
));

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
          minHeight: "120px" 
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
              No analysis.
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
      console.error("Error fetching user info:", error);
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
        console.error("Could not fetch diaries:", error);
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
    navigate("/");
  };

  return (
    <Grid minHeight={"calc(100vh - 50px)"} paddingBottom={7}>
      <Helmet>
        <title>My Diaries - AI Diary</title>
        <meta name="description" content="View your AI-assisted diaries and discover the analyses." />
        <meta name="keywords" content="diary, artificial intelligence, mood analysis, personal development, AI diary, diary analysis, writing diary, diary, ai, ai diary, diary ai" />
        <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "My Diaries - AI Diary",
            "description": "View your AI-assisted diaries and discover the analyses.",
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
        <Grid container spacing={3} direction="column" alignItems="center" py={5}>
          <Typography variant="h4" component="h1" gutterBottom>
            My Diaries
          </Typography>
          <MemoizedDiarySkeletons count={5} />
        </Grid>
      ) : (
        <Grid container spacing={3} direction="column" alignItems="center" py={5}>
            <Button 
              onClick={() => window.open("https://buymeacoffee.com/aidiary", "_blank")}
              sx={{
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
                  <img src="/coffee-icon.png" width={"35px"} height={"auto"}/>
                  <Typography className="coffee" sx={{ color: 'black', fontFamily: "'Cookie', cursive", textTransform:"lowercase" ,fontWeight: "450", fontSize:{xs:"22px", lg:"28px"} }}>
                  buy me a coffee
                  </Typography>
          </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          My Diaries
        </Typography>
        {currentDiaries.length > 0 ? (
          <MemoizedDiaries diaries={currentDiaries} />
        ) : (
          <Typography fontSize={"18px"}>You have no records yet.</Typography>
        )}
  
        {/* Pagination */}
        {totalPages > 1 && (
          <Grid display={"flex"} alignItems={"center"}>
            <Button
              variant="contained"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Typography fontSize={"16px"} sx={{ margin: "0 10px" }}>
              {currentPage} / {totalPages}
            </Typography>
            <Button
              variant="contained"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </Grid>
        )}
      </Grid>
      )}
  </Grid>
  );
};

export default Diaries;
