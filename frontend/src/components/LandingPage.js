import { Button, Typography } from "@mui/material";
import React from "react";
import { Grid } from '@mui/system';
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const LandingPage = () => {
    const navigate = useNavigate();
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Diary AI - AI-Powered Diary Application",
        "description": "Diary AI is an AI-powered personal diary app that helps you track your mood and analyze your daily thoughts.",
        "url": "https://aidiary.online",
        "image": "https://aidiary.online/preview-image.jpg"
    };
    return(
        <>
            <Helmet>
                <title>Diary AI - AI-Powered Diary Application</title>
                <meta name="description" content="Analyze your mood and manage your personal diary with AI using Diary AI." />
                <meta name="keywords" content="Diary AI, AI diary, personal diary, mood tracking, mood analysis" />
                <meta property="og:title" content="Diary AI - AI-Powered Diary Application" />
                <meta property="og:description" content="Analyze your diaries with AI and track your mood!" />
                <meta property="og:image" content="https://aidiary.online/preview-image.jpg" />
                <meta property="og:url" content="https://aidiary.online" />
                <meta name="twitter:title" content="Diary AI - AI-Powered Diary Application" />
                <meta name="twitter:description" content="Analyze your mood, manage your personal diary!" />
                <meta name="twitter:image" content="https://aidiary.online/preview-image.jpg" />
                <link rel="canonical" href="https://aidiary.online" />
                <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
            </Helmet>
            <div className="video-background">
                <video className="video-1" autoPlay loop muted>
                    <source src="/assets/background.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <Grid container height={"70vh"} alignItems={"center"} ml={{xs:1, md:5, lg:15}} mr={{xs:1, md:"unset"}} color={"white"}>
                <Grid display={"flex"} flexDirection={"column"} gap={3} bgcolor={"#0000003b"} padding={"30px"}>
                    <Typography variant="h3">
                        Create your safe space.
                    </Typography>
                    <Typography variant="h5">
                        Understand your mood better and track your mental state with Diary AI.
                    </Typography>
                    <Button variant="contained" color="secondary" sx={{width:"fit-content"}}  onClick={() => navigate("/home")}>
                        <Typography variant="h5">
                            Start Sharing
                        </Typography>
                    </Button>
                </Grid>
            </Grid>
        </>
    );
}

export default LandingPage;
