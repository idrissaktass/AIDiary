import { Button, Typography } from "@mui/material";
import React from "react";
import { Grid } from '@mui/system';
import "./LandingPage.css"
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();

    return(
        <>
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