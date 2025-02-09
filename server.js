const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 4040;

// YouTube API key from .env
const API_KEY = process.env.YOUTUBE_API_KEY; // Make sure to add your key in the .env file

// Enable CORS for frontend communication
app.use(cors());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to check if a streamer is live and get the number of viewers
app.get('/check-live', async (req, res) => {
  const { channelId } = req.query;

  if (!channelId) {
    return res.status(400).json({ error: 'Channel ID is required' });
  }

  try {
    // Fetch live stream info from YouTube API
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        channelId: channelId,
        type: 'video',
        eventType: 'live',
        key: API_KEY
      }
    });

    // If no live video is found, return offline status
    if (response.data.items.length === 0) {
      return res.json({ isLive: false });
    }

    // Get the video ID of the live stream
    const videoId = response.data.items[0].id.videoId;

    // Fetch live stream details (viewers count)
    const videoResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'liveStreamingDetails',
        id: videoId,
        key: API_KEY
      }
    });

    // Extract viewers count from the response
    const viewers = videoResponse.data.items[0]?.liveStreamingDetails.concurrentViewers || 0;

    return res.json({
      isLive: true,
      viewers,
      streamTitle: response.data.items[0].snippet.title
    });

  } catch (error) {
    console.error('Error fetching live status:', error);
    return res.status(500).json({ error: 'Failed to fetch live status' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
