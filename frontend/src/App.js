import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import PrivateRoute from "./components/PrivateRoute"; 
import WeeklyAnalysis from "./components/WeeklyAnalysis";
import LandingPage from "./components/LandingPage";
import Diaries from "./components/Diaries";
import "./App.css"
function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/weekly-analysis" element={<PrivateRoute><WeeklyAnalysis /></PrivateRoute>} />
          <Route path="/diaries" element={<PrivateRoute><Diaries /></PrivateRoute>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
