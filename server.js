const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000; // Use the environment port for Render or default to 3000
const API_KEY = "579b464db66ec23bdd000001d7b3d28e8a0142b96a2c476261a364f9";

// Use CORS middleware
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Route to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API endpoint to fetch data
app.get("/api/data", async (req, res) => {
  try {
    const limit = 4500; // Number of records per request
    const offset = 0; // Start from the first record

    const response = await axios.get(
      `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&limit=${limit}&offset=${offset}`
    );

    // Original metadata from the API response
    const metadata = {
      created: response.data.created,
      updated: response.data.updated,
      total: response.data.total,
      title: response.data.title,
      org: response.data.org,
      org_type: response.data.org_type,
      sector: response.data.sector,
    };

    // Filter data to include only records for Maharashtra
    const filteredRecords = response.data.records.filter(
      (record) => record.state === "Maharashtra"
    );

    // Combine the metadata and filtered records
    const result = {
      metadata,
      records: filteredRecords,
    };

    res.json(result); // Send both metadata and filtered data
  } catch (error) {
    console.error("Error fetching data from API:", error.message);
    res.status(500).send("Error fetching data");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
