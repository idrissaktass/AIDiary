import React, { useState } from "react";
import { Box, Grid, height } from '@mui/system';
import { Button, Typography } from "@mui/material";
import { motion } from "framer-motion"; 

const Features = () => {
    const [tellMe, setTellMe ] = useState(true);
    const [weekly, setWeekly ] = useState(false);
    const [graphs, setGraphs ] = useState(false);

    const handleClick = (feature) => {
        setTellMe(false);
        setWeekly(false);
        setGraphs(false);
    
        if (feature === 'tellMe') {
          setTellMe(true);
        } else if (feature === 'weekly') {
          setWeekly(true);
        } else if (feature === 'graphs') {
          setGraphs(true);
        }
      };

    const handleTryNowClick = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return(
        <Grid display={"flex"} justifyContent={"start"} flexDirection={"column"} alignItems={"center"} bgcolor={"white"} minHeight={"100vh"}>
            <Grid width={{xs:"95%", md:"80%"}} display={"flex"} justifyContent={"space-between"} pb={2} overflow="auto" flexDirection={{xs:"column", md:"unset"}}>
                <Typography p={"15px"} fontSize={{xs:"38px", sm:"50px"}}>FEATURES</Typography>
                <Grid display={"flex"} gap={2} alignItems={"center"} style={{ whiteSpace: "nowrap" }}>
                    <Typography p={"15px"} height={"fit-content"} 
                    color={tellMe ? "white" : "black"} onClick={() => handleClick('tellMe')} style={{ cursor: "pointer" }} bgcolor={tellMe ? "#de7618" : "unset"}>TELL ME</Typography>
                    <Typography p={"15px"}  height={"fit-content"}
                    color={weekly ? "white" : "black"} onClick={() => handleClick('weekly')} style={{ cursor: "pointer" }} bgcolor={weekly ? "#de7618" : "unset"}>WEEKLY ANALYSIS</Typography>
                    <Typography p={"15px"}  height={"fit-content"}
                    color={graphs ? "white" : "black"} onClick={() => handleClick('graphs')} style={{ cursor: "pointer" }} bgcolor={graphs ? "#de7618" : "unset"}>GRAPHS</Typography>
                </Grid>
            </Grid>
            <Grid width={{xs:"95%", md:"80%"}} container justifyContent={"space-between"} alignItems={"center"} mt={3} mb={6}>
            <Grid size={{ xs: 12, md: 7 }} mb={{xs:"25px", md:"0px"}}>
                    {/* Conditionally render the image with animation */}
                    {tellMe && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <Grid width={"100%"} height={{xs:"400px", md:"600px"}} position={"relative"}>
                                <Box component={"img"} src="/tellme.jpg" alt="Tell Me" width={"100%"} height={"100%"} 
                                sx={{objectFit:"cover"}} position={"absolute"} top={0} left={0}/>
                            </Grid>
                        </motion.div>
                    )}
                    {weekly && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <Grid width={"100%"} height={{xs:"400px", md:"600px"}} position={"relative"}>
                                <Box component={"img"} src="/mental.jpg" alt="Weekly Analysis" width={"100%"} height={"100%"} 
                                sx={{objectFit:"cover"}} position={"absolute"} top={0} left={0}/>
                            </Grid>
                        </motion.div>
                    )}
                    {graphs && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <Grid width={"100%"} height={{xs:"400px", md:"600px"}} position={"relative"}>
                                <Box component={"img"} src="/graphs.jpg" alt="Graphs" width={"100%"} height={"100%"} 
                                sx={{objectFit:"cover"}} position={"absolute"} top={0} left={0}/>
                            </Grid>
                        </motion.div>
                    )}
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} gap={4}>
                    {tellMe && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <Typography fontSize={{xs:"20px", md:"24px", xl:"28px"}} textAlign={{xs:"center", md:"start"}}>
                                Track your daily mood and emotions with our "Tell Me" feature. Share your thoughts, feelings, or experiences, and our AI will analyze your entry to provide insightful reports and personalized recommendations. You can keep a journal of your entries and revisit them whenever you'd like to reflect on your journey.
                            </Typography>
                        </motion.div>
                    )}
                    {weekly && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <Typography fontSize={{xs:"20px", md:"24px", xl:"28px"}} textAlign={{xs:"center", md:"start"}}>
                                Every week, take a moment to review your progress and receive a comprehensive weekly analysis. Based on your daily entries throughout the week, our AI will generate a personalized report, summarizing key insights and providing advice to help you move forward. All of your weekly analyses will be saved, so you can revisit them anytime.
                            </Typography>
                        </motion.div>
                    )}
                    {graphs && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <Typography fontSize={{xs:"20px", md:"24px", xl:"28px"}} textAlign={{xs:"center", md:"start"}}>
                                Our "Graphs" feature visualizes the data from your daily mood and stress ratings. After each journal entry, our AI assigns happiness and stress scores, which are then displayed in a clear and insightful graph. Monitor your emotional well-being over time and track your progress in a meaningful way.
                            </Typography>
                        </motion.div>
                    )}
                    <Button variant="contained" color="primary" sx={{backgroundColor:"#de7618", padding:"10px"}} onClick={handleTryNowClick}>
                        TRY NOW
                    </Button>
                </Grid>

            </Grid>
        </Grid>
    )
}
export default Features;