import { Button, Typography } from "@mui/material";
import React from "react";
import { Grid } from '@mui/system';
import "./LandingPage.css"
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const LandingPage = () => {
    const navigate = useNavigate();
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Diary AI - Yapay Zeka Destekli Günlük Uygulaması",
        "description": "Diary AI, günlüklerinizi analiz eden ve ruh halinizi takip etmenize yardımcı olan yapay zeka destekli kişisel günlük uygulamasıdır.",
        "url": "https://diary-ai-0.vercel.app",
        "image": "https://diary-ai-0.vercel.app/preview-image.jpg"
    };
    return(
        <>
            <Helmet>
                <title>Diary AI - Yapay Zeka Destekli Günlük Uygulaması</title>
                <meta name="description" content="Diary AI ile ruh halinizi analiz edin ve kişisel günlüklerinizi yapay zeka ile yönetin." />
                <meta name="keywords" content="Diary AI, yapay zeka günlük, kişisel günlük, ruh hali takibi, mod analizi" />
                <meta property="og:title" content="Diary AI - Yapay Zeka Destekli Günlük Uygulaması" />
                <meta property="og:description" content="Günlüklerinizi yapay zeka ile analiz edin ve ruh halinizi takip edin!" />
                <meta property="og:image" content="https://diary-ai-0.vercel.app/preview-image.jpg" />
                <meta property="og:url" content="https://diary-ai-0.vercel.app" />
                <meta name="twitter:title" content="Diary AI - Yapay Zeka Destekli Günlük Uygulaması" />
                <meta name="twitter:description" content="Ruh halinizi analiz edin, kişisel günlüklerinizi yönetin!" />
                <meta name="twitter:image" content="https://diary-ai-0.vercel.app/preview-image.jpg" />
                <link rel="canonical" href="https://diary-ai-0.vercel.app" />
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
                    Diary AI ile birlikte modunu daha iyi anla ve ruhsal durumunu takip et.
                    </Typography>
                    <Button variant="contained" color="secondary" sx={{width:"fit-content"}}  onClick={() => navigate("/home")}>
                    <Typography variant="h5">
                        Anlatmaya Başla
                    </Typography>
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}

export default LandingPage;