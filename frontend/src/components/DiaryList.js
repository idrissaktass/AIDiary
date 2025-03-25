import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, List, ListItem, ListItemText } from "@mui/material";

const DiaryList = ({ handleDiaryClick, entries }) => {
  const [selectedId, setSelectedId] = useState(null);

  const handleClick = (entry) => {
    setSelectedId(entry._id); 
    handleDiaryClick(entry);  
  };
  console.log("xd",entries)
  
  return (
    <Container maxWidth="sm" style={{ marginTop: 80 }}>
      <Typography variant="h5" gutterBottom>
        Geçmiş
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
