import React, { useState } from "react";
import { AppBar, Toolbar, Button, Typography, Container, IconButton, Drawer, List, ListItem, ListItemText, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./Navbar.css";

const Navbar = ({ onLogout, onNewDiary, onToggleDrawer, drawerOpen, username }) => {
  const isMobile = useMediaQuery("(max-width:900px)");
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = ["/home", "/", "/"].includes(location.pathname);
  const [drawerOpenState, setDrawerOpenState] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpenState(open);
  };

  const handleNavigation = (path) => {
    if (path === "/home" && location.pathname === "/home") {
      // Eğer zaten "/home" sayfasındaysak, sayfayı yeniden yükle
      window.location.reload();
    } else {
      // Diğer sayfalara git
      navigate(path);
    }
    setDrawerOpenState(false);
  };
  
  const handleMenuOpen = (event) => {
    if(!username) {
      handleNavigation("/");
    }
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position={isHomePage ? "absolute" : "static"} color="transparent" sx={{ zIndex: 999 }} className="navbar">
      <div className="video-navbar">
        <video className="video-nav" autoPlay loop muted>
          <source src="/assets/background.mp4" type="video/mp4" />
        </video>
      </div>
      <Container maxWidth="xl">
        <Toolbar sx={{ color: "white" }}>
          <Typography onClick={() => handleNavigation("/home")} fontSize="24px" fontWeight="800" color="#de7618" sx={{ flexGrow: 1, cursor: "pointer" }}>
            Diary AI
          </Typography>

          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpenState} onClose={toggleDrawer(false)}>
                <List>
                  <ListItem button onClick={() => handleNavigation("/home")}>
                    <ListItemText primary="Tell Me" />
                  </ListItem>
                  <ListItem button onClick={() => handleNavigation("/weekly-analysis")}>
                    <ListItemText primary="Weekly Analysis" />
                  </ListItem>
                  <ListItem button onClick={() => handleNavigation("/diaries")}>
                    <ListItemText primary="My Diaries" />
                  </ListItem>
                  {location.pathname === "/home" && (
                    <ListItem button onClick={() => { onToggleDrawer(!drawerOpen); setDrawerOpenState(false); }}>
                      <ListItemText primary="History" />
                    </ListItem>
                  )}
                  {username && (
                    <ListItem>
                      <ListItemText primary={username} />
                    </ListItem>
                  )}
                  {/* <ListItem>
                    <ListItemText onClick={() => handleNavigation("/subscription")} primary="Go Premium" />
                  </ListItem> */}
                  {username ? (
                    <ListItem button onClick={onLogout}>
                      <ListItemText primary="Logout" />
                    </ListItem>
                  ) : (
                    <ListItem button onClick={() => handleNavigation("/")}>
                      <ListItemText primary="Login" />
                    </ListItem>
                  )}
                </List>
              </Drawer>
            </>
          ) : (
            <>
              <Button color="inherit" sx={{ textTransform: "none" }} onClick={() => handleNavigation("/home")}>
                <Typography variant="h6">Tell Me</Typography>
              </Button>
              <Button color="inherit" sx={{ textTransform: "none" }} onClick={() => handleNavigation("/weekly-analysis")}>
                <Typography variant="h6">Weekly Analysis</Typography>
              </Button>
              <Button color="inherit" sx={{ textTransform: "none" }} onClick={() => handleNavigation("/diaries")}>
                <Typography variant="h6">My Diaries</Typography>
              </Button>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <AccountCircleIcon />
              </IconButton>
              {username && (
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem>{username}</MenuItem>
                  {/* <MenuItem onClick={() => handleNavigation("/subscription")}>Go Premium</MenuItem> */}
                  <MenuItem onClick={onLogout}>Logout</MenuItem>
                </Menu>
              )}
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
