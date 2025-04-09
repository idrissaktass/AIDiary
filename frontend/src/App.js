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


function AppContent() {
  const location = useLocation();
  const hideFooterRoutes = ["/"];
 
  return (
    <div className="app">
      <HelmetProvider>
      <Helmet>
        <title>Diary AI - Personal Journal and Mood Analysis</title>
        <meta name="google-site-verification" content="qWuFVhUHkiJjBTNgbKDHhSduS6BoA8ZDMTkXO2N6wYg" />
        <meta name="google-site-verification" content="qWuFVhUHkiJjBTNgbKDHhSduS6BoA8ZDMTkXO2N6wYg" />
        <meta name="description" content="Diary AI analyzes your journals to track your mood and contribute to your personal development." />
        <meta name="keywords" content="Diary AI, personal journal, artificial intelligence, mood analysis, psychology, ai diary, diary ai, ai, diary, journal, weekly analysis, stress, stress level" />
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
