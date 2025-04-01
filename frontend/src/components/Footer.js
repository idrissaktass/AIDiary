import React from "react";
import { Grid } from '@mui/system';
import { Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLanding = () => {
        navigate("/");
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Diary AI",
        "url": "https://aidiary.online",
        "logo": "https://aidiary.online/logo.png",
        "sameAs": [
            "https://facebook.com/DiaryAI",
            "https://twitter.com/DiaryAI",
            "https://instagram.com/DiaryAI"
        ]
    };

    return (
        <>
            <Helmet>
                <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
            </Helmet>
            <Grid 
                position={"relative"} 
                bottom={0} 
                width={"100%"} 
                sx={{background:"linear-gradient(to right,rgb(10, 19, 31), #294d71, #101e2d)"}}
                display={"flex"} 
                justifyContent={"space-between"} 
                alignItems={"center"} 
                p={"10px 30px 10px 30px"}
            >
                <Typography 
                    onClick={handleLanding} 
                    fontSize={"20px"} 
                    fontWeight={"700"} 
                    color="#de7618" 
                    sx={{ cursor: "pointer" }}
                >
                    Diary AI
                </Typography>
                <Typography 
                    fontSize={"14px"} 
                    fontWeight={"400"} 
                    color="white"
                >
                    © {new Date().getFullYear()} Diary AI - Tüm Hakları Saklıdır.
                </Typography>
            </Grid>
        </>
    );
}

export default Footer;
