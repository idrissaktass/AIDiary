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
        <Grid>
          <Typography onClick={handleLanding} fontSize={"20px"} fontWeight={"700"} color="#de7618" sx={{ flexGrow: 1, cursor: "pointer" }}>
            Diary AI
          </Typography>
          <Typography onClick={handleHome} fontSize={"20px"} fontWeight={"700"} color="WHİTE" sx={{ flexGrow: 1, cursor: "pointer" }}>
            Home
          </Typography>
        </Grid>
    )
}

export default Footer;