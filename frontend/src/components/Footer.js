import React from "react";
import { Grid } from '@mui/system';
import { Button, Typography} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleHome = () => {
        if (location.pathname === "/home") {
          window.location.reload();
        } else {
          navigate("/home");
        }
      };

    const handleLanding = () => {
        navigate("/");
    };

    return(
        <Grid position={"relative"} bottom={0} width={"100%"} sx={{background:"linear-gradient(to right,rgb(10, 19, 31), #294d71, #101e2d)"}} display={"flex"} justifyContent={"space-between"} alignItems={"center"} p={"10px 30px 10px 30px"}>
          <Typography onClick={handleLanding} fontSize={"20px"} fontWeight={"700"} color="#de7618" sx={{ cursor: "pointer" }}>
            Diary AI
          </Typography>
          <Typography onClick={handleHome} fontSize={"16px"} fontWeight={"600"} color="white" sx={{ cursor: "pointer" }}>
            Home
          </Typography>
        </Grid>
    )
}

export default Footer;