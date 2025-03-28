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

function AppContent() {
  const location = useLocation();
  const hideFooterRoutes = ["/"];

  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/weekly-analysis" element={<PrivateRoute><WeeklyAnalysis /></PrivateRoute>} />
        <Route path="/diaries" element={<PrivateRoute><Diaries /></PrivateRoute>} />
      </Routes>

      {!hideFooterRoutes.includes(location.pathname) && <Footer/>}
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
