import React, { useEffect, useState, useRef } from "react";
import { Box, TextField, IconButton, Typography, Paper } from "@mui/material";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { Grid } from '@mui/system';

const AIChat = () => {
  const [messages, setMessages] = useState([{ sender: "ai", text: "How do you do today?" }]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [messageLoading, setMessageLoading] = useState(false);
  const bottomRef = useRef(null);
  const [aiMessageCount, setAiMessageCount] = useState(0);

  useEffect(() => {
    const aiMessages = messages.filter((msg) => msg.sender === "ai");
    setAiMessageCount(aiMessages.length);
    const token = localStorage.getItem("token");
    if (token) fetchUserInfo(token);
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messageLoading]);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch("https://ai-diary-backend-gamma.vercel.app/api/user", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setIsLoggedIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setMessageLoading(true);

    const loadingAIMessage = { sender: "ai", text: "" };
    setMessages((prev) => [...prev, loadingAIMessage]);

    try {
      const res = await fetch("https://ai-diary-backend-gamma.vercel.app/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await res.json();

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: "ai", text: data.reply };
        return updated;
      });

    } catch (error) {
      console.error("AI mesajı alınırken hata:", error);
    } finally {
      setMessageLoading(false);
    }
  };

  const handleRefresh = () => {
    setMessages([{ sender: "ai", text: "How do you do today?" }]);
    setAiMessageCount(0);
  };

  return (
    <Grid minHeight={"100vh"}>
      <Navbar username={username} onLogout={handleLogout} />
      <Grid container direction="column" alignItems="center">
        <Grid item size={{ xs: 11.5, sm: 10, md: 8, lg: 5 }} display={"flex"} alignItems={"center"} flexDirection={"column"} justifyContent={"center"} paddingTop={{ xs: "10%", sm: "3%", md: "2%" }}>
          <Typography fontSize={{ xs: "18px", }} align="center" mb={4}>
            Welcome to the AI Chat! This chat is designed to help analyze your mental health and track your mood over time. 
            Engage with the AI by typing your message, and it will provide insights based on your responses.
          </Typography>
          <Paper sx={{
            position: "relative", paddingTop: "20px", height: { xs: "370px", sm: "400px", md: "450px", xl: "500px" },
            borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px", paddingBottom: "10px",
            width: "100%", overflow: "auto", backgroundColor: "#f5f5f5"
          }}>
            {messages.map((msg, idx) => (
              <Box px={2} key={idx} display="flex" justifyContent={msg.sender === "user" ? "flex-end" : "flex-start"} mb={1}>
                <Box
                  bgcolor={msg.sender === "user" ? "#1976d2" : "#e0e0e0"}
                  color={msg.sender === "user" ? "white" : "black"}
                  px={2}
                  py={1}
                  borderRadius={2}
                  maxWidth="80%"
                >
                  {msg.sender === "ai" && messageLoading && idx === messages.length - 1 ? (
                    <lord-icon
                      src="https://cdn.lordicon.com/jpgpblwn.json"
                      trigger="loop"
                      state="loop-scale"
                      style={{ width: "30px", height: "30px", color: "black" }}
                      aria-label="AI is typing"
                    />
                  ) : (
                    <Typography>{msg.text}</Typography>
                  )}
                </Box>
              </Box>
            ))}
            <div ref={bottomRef} />
          </Paper>
          <Grid display="flex" width={"100%"} position={"sticky"} bottom={0} bgcolor={"white"} p={1} boxShadow={"0px 1px 2px #808080a1"} mt={0}>
            <TextField
              sx={{ backgroundColor: "transparent", input: { height: { xs: "10px", sm: "unset" } } }}
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={aiMessageCount >= 6}
              aria-label="Type your message"
            />
            <IconButton color="primary" onClick={sendMessage} disabled={aiMessageCount >= 6} aria-label="Send message">
              <Typography>Send</Typography>
            </IconButton>
          </Grid>
          {aiMessageCount >= 6 && (
            <Typography mt={1} color="gray" display={"flex"} gap={0.5}>
              The emotional analysis is complete. <Typography color="blue" sx={{ cursor: "pointer" }} onClick={handleRefresh} aria-label="Refresh chat">Refresh</Typography> to start a new session.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AIChat;
