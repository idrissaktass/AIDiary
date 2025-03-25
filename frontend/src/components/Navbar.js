import React, { useState } from "react";
import { AppBar, Toolbar, Button, Typography, Container, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate, useLocation } from "react-router-dom";
import './Navbar.css'; 

const Navbar = ({ onLogout, onNewDiary, onToggleDrawer, drawerOpen, username }) => {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuEl, setUserMenuEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuEl(null);
  };

  const handleClick = () => {
    if (location.pathname === "/home") {
      window.location.reload();
    } else {
      navigate("/home");
    }
  };

  const handleWeek = () => {
    navigate("/weekly-analysis");
  };

  const handleDiaries = () => {
    navigate("/diaries");
  };

  const handleLanding = () => {
    navigate("/");
  };

  return (
    <AppBar position="static" color="transparent" sx={{ zIndex: "999" }} className="navbar">
      <div className="video-navbar">
        <video className="video-nav" autoPlay loop muted>
          <source src="/assets/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <Container maxWidth="xl">
        <Toolbar sx={{ color: "white" }}>
          <Typography onClick={handleLanding} fontSize={"24px"} fontWeight={"800"} color="#de7618" sx={{ flexGrow: 1, cursor: "pointer" }}>
            Diary AI
          </Typography>

          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => { handleClick(); setAnchorEl(null); }}>
                  <Typography fontSize={"18px"}>Anlat Bakalım</Typography>
                </MenuItem>
                <MenuItem onClick={handleWeek}>
                  <Typography fontSize={"18px"}>Haftalık Analiz</Typography>
                </MenuItem>
                <MenuItem onClick={handleDiaries}>
                  <Typography fontSize={"18px"}>Anlattıklarım</Typography>
                </MenuItem>
                {location.pathname === "/home" && (
                  <MenuItem onClick={() => { onToggleDrawer(!drawerOpen); setAnchorEl(null); }}>
                    <Typography fontSize={"18px"}>{drawerOpen ? "Close Diary List" : "Open Diary List"}</Typography>
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" sx={{ textTransform: "none" }} onClick={handleClick}>
                <Typography fontSize={"20px"} fontWeight={"700"}>Anlat Bakalım</Typography>
              </Button>
              <Button color="inherit" sx={{ textTransform: "none" }} onClick={handleWeek}>
                <Typography fontSize={"20px"} fontWeight={"700"}>Haftalık Analiz</Typography>
              </Button>
              <Button color="inherit" sx={{ textTransform: "none" }} onClick={handleDiaries}>
                <Typography fontSize={"20px"} fontWeight={"700"}>Anlattıklarım</Typography>
              </Button>
              {/* Kullanıcı adı ve dropdown */}
              {username && (
                  <Button
                  color="inherit"
                  sx={{ textTransform: "none", display: "flex", alignItems: "center" }}
                  onClick={handleUserMenuOpen}
                >
                  <Typography fontSize={"18px"} fontWeight={"600"}>{username}</Typography>
                  <ArrowDropDownIcon />
                </Button>
              )}
              <Menu anchorEl={userMenuEl} open={Boolean(userMenuEl)} onClose={handleUserMenuClose}>
                <MenuItem onClick={onLogout}>
                  <Typography fontSize={"18px"}>Çıkış Yap</Typography>
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
