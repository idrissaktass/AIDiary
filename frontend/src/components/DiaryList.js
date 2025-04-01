import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, List, ListItem, ListItemText } from "@mui/material";
import { Helmet } from "react-helmet-async";

const DiaryList = ({ handleDiaryClick, entries }) => {
  const [selectedId, setSelectedId] = useState(null);

  const handleClick = (entry) => {
    setSelectedId(entry._id);
    handleDiaryClick(entry);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "AI Diaries",
    "description": "Explore and analyze your AI-powered diaries.",
    "url": window.location.href,
    "blogPost": entries.map(entry => ({
      "@type": "BlogPosting",
      "headline": entry.text?.split(' ').slice(0, 5).join(' ') + "...",
      "datePublished": new Date(entry.date).toISOString(),
      "author": {
        "@type": "Person",
        "name": "AI Diary User"
      }
    }))
  };

  return (
      <Container maxWidth="sm" style={{ marginTop: 80 }}>
      <Helmet>
        <title>Diary Archive | AI Diary</title>
        <meta name="description" content="Browse your AI-powered diary archive and review past analyses." />
        <meta property="og:title" content="Diary Archive | AI Diary" />
        <meta property="og:description" content="View your AI-powered diaries and discover your analyses." />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
        <Typography variant="h5" gutterBottom>
          Past Diaries
        </Typography>
        <List>
          {entries.length > 0 ? (
            entries.map((entry) => (
              <ListItem
                key={entry._id}
                divider
                button
                onClick={() => handleClick(entry)}
                sx={{
                  cursor: "pointer",
                  bgcolor: entry._id === selectedId ? "#0080000a" : "transparent",
                }}
              >
                <ListItemText
                  primary={`${entry.text?.split(' ').slice(0, 3).join(' ')}...`}
                  secondary={`Mood: ${entry.mood ? entry.mood.split(' ').slice(0, 3).join(' ') : 'Not specified'} | ${new Date(entry.date).toLocaleDateString()}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography>You don't have any entries yet.</Typography>
          )}
        </List>
      </Container>
  );
};

export default DiaryList;
