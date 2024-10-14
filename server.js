const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable provided by Render
const API_KEY = "579b464db66ec23bdd000001d7b3d28e8a0142b96a2c476261a364f9";

// Use CORS middleware
app.use(cors());

// Serve static files from the root directory (update this if necessary)
app.use(express.static(path.join(__dirname))); // Adjusted to serve from the current directory

app.get("/api/data", async (req, res) => {
  try {
    const limit = 4500; // Number of records per request
    const offset = 0; // Start from the first record

    const response = await axios.get(
      `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&limit=${limit}&offset=${offset}`
    );

    const metadata = {
      created: response.data.created,
      updated: response.data.updated,
      total: response.data.total,
      title: response.data.title,
      org: response.data.org,
      org_type: response.data.org_type,
      sector: response.data.sector,
    };

    const filteredRecords = response.data.records.filter(
      (record) => record.state === "Maharashtra"
    );

    const result = {
      metadata,
      records: filteredRecords,
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching data from API:", error.message);
    res.status(500).send("Error fetching data");
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // Serve your index.html file for all other requests
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
