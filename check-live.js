async function checkLiveChannel(videoUrl) {
    try {
      // Step 1: Extract video ID
      const videoId = extractVideoId(videoUrl);
      if (!videoId) {
        return { error: 'Invalid video URL' };
      }
  
      console.log("Extracted videoId: ", videoId); // Debugging log
  
      // Step 2: Make API call to get video details and channel ID
      const apiKey = process.env.YOUTUBE_API_KEY; // Ensure your API key is stored in the .env file
      const videoInfoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=${videoId}&key=${apiKey}`;
  
      console.log("Fetching video data from URL: ", videoInfoUrl); // Debugging log
  
      const videoData = await axios.get(videoInfoUrl);
  
      // Check if video data exists
      if (videoData.data.items.length === 0) {
        return { error: 'Video not found or API quota exceeded' };
      }
  
      // Extract channelId from the response
      const channelId = videoData.data.items[0].snippet.channelId;
      console.log("Channel ID fetched: ", channelId); // Debugging log
  
      // Step 3: Check if the channel is live
      const liveInfoUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${apiKey}`;
      const liveData = await axios.get(liveInfoUrl);
  
      if (liveData.data.items.length > 0) {
        return { live: true, channelId: channelId };
      } else {
        return { live: false, channelId: channelId };
      }
    } catch (error) {
      console.error('Error fetching channel ID:', error.message);
      return { error: `Error fetching channel ID: ${error.message}` }; // Enhanced error message
    }
  }
  