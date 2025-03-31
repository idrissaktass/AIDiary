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
    "name": "AI Günlükleri",
    "description": "Yapay zeka destekli günlüklerinizi keşfedin ve analiz edin.",
    "url": window.location.href,
    "blogPost": entries.map(entry => ({
      "@type": "BlogPosting",
      "headline": entry.text?.split(' ').slice(0, 5).join(' ') + "...",
      "datePublished": new Date(entry.date).toISOString(),
      "author": {
        "@type": "Person",
        "name": "AI Diary Kullanıcısı"
      }
    }))
  };

  return (
      <Container maxWidth="sm" style={{ marginTop: 80 }}>
      <Helmet>
        <title>Günlük Arşivi | AI Diary</title>
        <meta name="description" content="Yapay zeka destekli günlük arşivinize göz atın ve geçmiş analizlerinizi inceleyin." />
        <meta property="og:title" content="Günlük Arşivi | AI Diary" />
        <meta property="og:description" content="Yapay zeka destekli günlüklerinizi görüntüleyin ve analizleri keşfedin." />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
        <Typography variant="h5" gutterBottom>
          Geçmiş Günlükler
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
                  secondary={`Ruh Hali: ${entry.mood ? entry.mood.split(' ').slice(0, 3).join(' ') : 'Belirtilmemiş'} | ${new Date(entry.date).toLocaleDateString()}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography>Henüz kaydınız yok.</Typography>
          )}
        </List>
      </Container>
  );
};

export default DiaryList;
