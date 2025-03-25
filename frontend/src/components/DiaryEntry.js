import { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Typography, Snackbar, Alert , CircularProgress } from "@mui/material";
import { motion } from "framer-motion";  
import { Grid } from '@mui/system';

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

  useEffect(() => {
    if (selectedDiary) {
      setText(selectedDiary.text);
      setMood(selectedDiary.mood || "");
    } else {
      setText("");
      setMood("");
      fetchMostRecentMood();

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
      setShowMood(false);  
      setTimeout(() => {  
        setMood(res.data.mood);
        setShowMood(true); 
        setLoading(false);  
      }, 500);
    } catch (error) {
      console.error("Axios error:", error);
      alert("Bir hata oluştu!");
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
        { text, mood, token, userId: selectedDiary ? selectedDiary.userId : null },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('E')
      if (res.data) {
        handleDiarySave(res.data);
      }
      if(!mood) {
        console.log('Entered the ser')
        setText("");
      }
      console.log('Entered the serverless')
      setSnackbarMessage("Günlük başarıyla kaydedildi!");
      setSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Axios error:", error);
      setSnackbarMessage("Bir hata oluştu!");
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
          {selectedDiary ? "Günlük Analizin" : "Anlat Bakalım"} 📝
        </Typography>

        {!selectedDiary && !mood ? (
          <motion.div
          style={{width:"100%"}}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
          >
            <TextField 
              sx={{zIndex:"0", backgroundColor:"white", boxShadow:"0px 5px 10px rgba(0, 0, 0, 0.16)", borderRadius:"3px"}}
              label="Bugün neler oldu?"
              multiline
              fullWidth
              rows={5}
              variant="outlined"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={saving} 
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
            <Typography variant="body1" bgcolor={"#8000000a"} padding={"30px"} mt={2} textAlign={"start"}>
              Ruh Halin: {mood}
            </Typography>
          </motion.div>
        )}
        
        <Grid display={"flex"} gap={2} my={5} justifyContent={"center"} width={"100%"}>
              {!mood && (
                <Button variant="contained" color="primary" sx={{backgroundColor:"#1764b0"}} disabled={!text || loading} onClick={analyzeMood}>
                  {loading ? "Yükleniyor..." : "Analiz Et"}
                </Button>
              )}
              {!selectedDiary && (
                  <Button variant="contained" color="secondary" sx={{backgroundColor:"#de7618"}}  disabled={!text || loading || saving} onClick={saveDiary}>
                      {saving ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
              )}
          </Grid>
          {!selectedDiary && !mood && loadingRecentMood ? ( // Display loading indicator while fetching recent mood
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2 }}
            >
              <Grid display="flex" justifyContent="center" mt={3}>
                <CircularProgress />
              </Grid>
            </motion.div>
          ) : recentMood && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2 }}
            >
              <Grid>
                <Typography variant="h6">
                  Son Analiz
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
