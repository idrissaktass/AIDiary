import { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Typography, Snackbar, Alert , CircularProgress, Box, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";  
import { Grid } from '@mui/system';
import { Helmet } from "react-helmet-async";

const DiaryEntry = ({ token, selectedDiary, handleDiarySave }) => {
  const [text, setText] = useState(selectedDiary ? selectedDiary.text : ""); 
  const [mood, setMood] = useState(selectedDiary ? selectedDiary.mood : ""); 
  const [loading, setLoading] = useState(false);  
  const [showMood, setShowMood] = useState(false); 
  const [recentMood, setRecentMood] = useState(null); 
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success"); 
  const [saving, setSaving] = useState(false); 
  const [loadingRecentMood, setLoadingRecentMood] = useState(false);
  const [happinessScore, setHappinessScore] = useState(null);
  const [stressScore, setStressScore] = useState(null);
  // const [additionalEmotions, setAdditionalEmotions] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [entryCount, setEntryCount] = useState(0); 
  const [saved, setSaved] = useState(false); 

  useEffect(() => {
    if (selectedDiary) {
      setText(selectedDiary.text);
      setMood(selectedDiary.mood || "");
      setHappinessScore(selectedDiary.happinessScore || null);
      setStressScore(selectedDiary.stressScore || null);
      // setAdditionalEmotions(selectedDiary.additionalEmotions || "");
    } else {
      setText("");
      setMood("");
      fetchMostRecentMood();
      fetchDiaryEntriesForToday();
    }
  }, [selectedDiary]);

  const fetchMostRecentMood = async () => {
    setLoadingRecentMood(true); 
    try {
      const res = await axios.get("https://ai-diary-backend-gamma.vercel.app/api/diaries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const diaryWithMood = res.data.find(diary => diary.mood);
      
      if (diaryWithMood) {
        setRecentMood(diaryWithMood.mood); 
      } else {
        setRecentMood(null); 
      }
    } catch (error) {
      console.error("Axios error:", error);
    }finally {
      setLoadingRecentMood(false); 
    }
  };

  const fetchDiaryEntriesForToday = async () => {
    try {
      const res = await axios.get("https://ai-diary-backend-gamma.vercel.app/api/diaries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const today = new Date().toISOString().split("T")[0];
      const entriesToday = res.data.filter(diary => {
        const entryDate = new Date(diary.date).toISOString().split("T")[0];
        return entryDate === today;
      });

      setEntryCount(entriesToday.length);
    } catch (error) {
      console.error("Error fetching diary entries for today:", error);
    }
  };

  const analyzeMood = async () => {
    setLoading(true);  
    try {
      const res = await axios.post(
        "https://ai-diary-backend-gamma.vercel.app/api/analyze-mood",
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("AI Response:", res.data);

      setShowMood(false);  
      setTimeout(() => {  
        setMood(res.data.mood_analysis);  
        setHappinessScore(res.data.happiness_score);  
        setStressScore(res.data.stress_score);  
        // setAdditionalEmotions(res.data.additionalEmotions || "");
        setShowMood(true); 
        setLoading(false);  
      }, 500);
    } catch (error) {
      console.error("Axios error:", error);
      alert("An error occurred!");
      setLoading(false);
    }
  };

  const saveDiary = async () => {
    setSaving(true);  
    console.log('Entered')
    try {
      console.log('try')
      const res = await axios.post(
        "https://ai-diary-backend-gamma.vercel.app/api/save-diary",
        { text, mood, happinessScore, stressScore, token, userId: selectedDiary ? selectedDiary.userId : null },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('E')
      if (res.data) {
        setSaved(true);
        handleDiarySave(res.data);
      }
      if(!mood) {
        console.log('Entered the ser')
        setText("");
      }
      console.log('Entered the serverless')
      setSnackbarMessage("Diary saved successfully!");
      setSaved(true);
      setSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Axios error:", error);
      setSnackbarMessage("An error occurred!");
      setSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setSaving(false); 
    }
  };
  

  return (
    <Grid container mt={5} size={{xs:11.5, sm:10, md:9}}>
      <Grid display={"flex"} flexDirection={"column"} width={"100%"}>
        <Typography variant="h4" gutterBottom width={"100%"} textAlign={"center"} mb={3}>
          {selectedDiary ? "Your Diary Analysis" : "Tell Me"} 📝
        </Typography>
        <Helmet>
          <title>Write Diary - AI Diary</title>
          <meta name="description" content="Analyze your diaries with AI and discover your mood!" />
          <meta name="keywords" content="diary, AI diary, mood analysis, AI journal, happiness, stress analysis" />
          <meta name="author" content="AI Diary" />
          <meta property="og:title" content="Write Diary - AI Diary" />
          <meta property="og:description" content="Analyze your diaries with AI and discover your mood!" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:image" content="https://ai-diary-backend-gamma.vercel.app/static/diary-image.png" />
          
          <script type="application/ld+json">
          {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Write Diary - AI Diary",
              "description": "Analyze your diaries with AI and discover your mood!",
              "author": {
                  "@type": "Person",
                  "name": "AI Diary"
              },
              "datePublished": new Date().toISOString(),
              "url": window.location.href
          })}
          </script>
      </Helmet>
          {entryCount >= 3 && (
            <Typography variant="body2" color="error" textAlign="center" mb={2}>
              You have reached the limit of 3 diary entries for today.
            </Typography>
          )}
        {!selectedDiary && !mood ? (
          <motion.div
          style={{width:"100%"}}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
          >
            <TextField 
              sx={{zIndex:"0", backgroundColor:"white", boxShadow:"0px 5px 10px rgba(0, 0, 0, 0.16)", borderRadius:"3px"}}
              label="What happened today?"
              multiline
              fullWidth
              rows={isMobile ? 7 : 5}
              variant="outlined"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={saving || entryCount >= 3} 
            />
          </motion.div>
        ) : (
            <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            >
              <Typography variant="body1" bgcolor={"#0080000a"} padding={"30px"} textAlign={"start"}>
                {text}
              </Typography>
            </motion.div>
        )}
        {(showMood || mood) && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Grid bgcolor={"#8000000a"} padding={"30px"} mt={2} textAlign={"start"}>
              <Typography variant="body1">
                Your Mood: {mood}
              </Typography>
              {happinessScore && (
              <Typography variant="body1" bgcolor={"#f0e68c"} padding={"20px"} mt={2} textAlign={"start"}>
                Happiness Score: {happinessScore}/10
              </Typography>
              )}
              {stressScore && (
                <Typography variant="body1" bgcolor={"#f0e68c"} padding={"20px"} mt={2} textAlign={"start"}>
                  Stress Score: {stressScore}/10
                </Typography>
              )}
            </Grid>
          </motion.div>
        )}

        
        <Grid display={"flex"} gap={2} my={5} justifyContent={"center"} width={"100%"}>
              {!mood && (
                <Button startIcon={<Box component="img" src="/assets/premium.svg" alt="Premium" style={{ width: 20, height: 20 }} />}
                variant="contained" color="primary" sx={{backgroundColor:"#1764b0"}} disabled={!text || loading} onClick={analyzeMood} >
                  {loading ? "Loading..." : "Analyze"}
                </Button>
              )}
              {!selectedDiary && (
                  <Button variant="contained" color="secondary" sx={{backgroundColor:"#de7618"}}  disabled={!text || loading || saving || saved} onClick={saveDiary}>
                      {saving ? "Saving..." : "Save"}
                  </Button>
              )}
          </Grid>
          {loadingRecentMood ? ( // Display loading indicator while fetching recent mood
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2 }}
            >
              <Grid display="flex" justifyContent="center" mt={3}>
                <CircularProgress />
              </Grid>
            </motion.div>
          ) : (!selectedDiary && recentMood && !mood) && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2 }}
            >
              <Grid mb={6}>
                <Typography variant="h6">
                  Recent Analysis
                </Typography>
                <Grid bgcolor={"gray"} width={"100%"} height={"1px"} mt={1}></Grid>
                <Typography variant="body1" bgcolor={"#8000000a"} padding={"30px"} mt={3}>
                  {recentMood}
                </Typography>
              </Grid>
            </motion.div> 
          )}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }} 
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity={severity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

      </Grid>
    </Grid>
  );
};

export default DiaryEntry;
