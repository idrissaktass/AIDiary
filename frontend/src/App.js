import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import PrivateRoute from "./components/PrivateRoute"; 
import WeeklyAnalysis from "./components/WeeklyAnalysis";
import LandingPage from "./components/LandingPage";
import Diaries from "./components/Diaries";
import Footer from "./components/Footer";
import "./App.css"
import { Helmet, HelmetProvider } from "react-helmet-async";
import PrivacyPolicy from "./components/PrivacyPolicy";
import RefundPolicy from "./components/RefundPolicy";
import TermsOfService from "./components/TermsOfService";
import AIChat from "./components/AIChat";
import { Button, Typography } from "@mui/material";

function AppContent() {
  const location = useLocation();
  const hideFooterRoutes = ["/"];
  const showButton = location.pathname !== "/";

  return (
    <div className="app">
      <HelmetProvider>
      <Helmet>
        <title>Diary AI - Kişisel Günlük ve Ruh Hali Analizi</title>
        <meta name="google-site-verification" content="qWuFVhUHkiJjBTNgbKDHhSduS6BoA8ZDMTkXO2N6wYg" />
        <meta name="google-site-verification" content="qWuFVhUHkiJjBTNgbKDHhSduS6BoA8ZDMTkXO2N6wYg" />
        <meta name="description" content="Diary AI, günlüklerinizi analiz ederek ruh halinizi takip eder ve kişisel gelişiminize katkı sağlar." />
        <meta name="keywords" content="Diary AI, kişisel günlük, yapay zeka, ruh hali analizi, psikoloji" />
      </Helmet>
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/privacy-notice" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        {/* <Route path="/signup" element={<SignUp />} /> */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/weekly-analysis" element={<PrivateRoute><WeeklyAnalysis /></PrivateRoute>} />
        <Route path="/diaries" element={<PrivateRoute><Diaries /></PrivateRoute>} />
        <Route path="/ai-chat" element={<PrivateRoute><AIChat /></PrivateRoute>} />
      </Routes>
      
        {showButton && (
          <Button 
          onClick={() => window.open("https://buymeacoffee.com/aidiary", "_blank")}
          sx={{
            position: 'absolute', 
            top: {xs:"unset", md:"80px"}, 
            left: '20px', 
            bottom : {xs:"80px", md:"unset"},
            zIndex: 1000,
            padding: '5px 10px 5px 10px',
            backgroundColor: '#ffdd00',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}>
            <img src="/coffee-icon.png" width={"35px"} height={"auto"}/>
            <Typography className="coffee" sx={{ color: 'black', fontFamily: "'Cookie', cursive", textTransform:"lowercase" ,fontWeight: "450", fontSize:{xs:"22px", lg:"28px"} }}>
              buy me a coffee
            </Typography>

          </Button>
        )}

      {!hideFooterRoutes.includes(location.pathname) && <Footer/>}
      </HelmetProvider>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
