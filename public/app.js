const streamers = [
    { name: 'FarCar', channelId: 'UC3XLpGsH9B6aunwDpX2043Q' },
    { name: 'StreamerX', channelId: 'UCxQkjcFlF5xg6s5g8Zw29n7' },
    { name: 'GamingLive', channelId: 'UCZJpMmmjFZ40f2tpg2J0P7z' },
    // Add more streamers here
  ];
  
  const streamerList = document.getElementById('streamerList');
  const videoPlayer = document.getElementById('videoPlayer');
  const chatBox = document.getElementById('chatBox');
  
  // Function to check if a streamer is live and get their title and number of viewers
  async function checkLiveStatus(channelId) {
    const response = await fetch(`http://localhost:4040/check-live?channelId=${channelId}`);
    const data = await response.json();
    return data;
  }
  
  // Function to load the streamer list
  async function loadStreamerList() {
    for (const streamer of streamers) {
      const { isLive, viewers, title } = await checkLiveStatus(streamer.channelId);
      const streamerItem = document.createElement('div');
      streamerItem.className = 'streamer-item';
      streamerItem.innerHTML = `
        ${streamer.name} - 
        <span class="live-status">
          <span class="dot ${isLive ? 'live' : 'offline'}"></span>
          ${isLive ? `${viewers} viewers` : 'OFFLINE'}
        </span>
        <span class="stream-title" title="${title}">${title.length > 40 ? title.slice(0, 40) + '...' : title}</span>
      `;
      streamerItem.addEventListener('click', () => loadStreamerContent(streamer.channelId, title));
      streamerList.appendChild(streamerItem);
    }
  }
  
  // Function to load the streamer content (video and chat)
  function loadStreamerContent(channelId, title) {
    videoPlayer.innerHTML = `
      <iframe width="100%" height="100%" src="https://www.youtube.com/embed/live_stream?channel=${channelId}" frameborder="0" allowfullscreen></iframe>
    `;
    chatBox.innerHTML = `
      <iframe width="100%" height="100%" src="https://www.youtube.com/live_chat?v=${channelId}" frameborder="0"></iframe>
      <button class="pop-out-chat" onclick="popOutChat('${channelId}')">Pop Out Chat</button>
    `;
  }
  
  // Function to pop out the chat in a new window
  function popOutChat(channelId) {
    window.open(`https://www.youtube.com/live_chat?v=${channelId}`, '_blank', 'width=400,height=600');
  }
  
  // Load the streamer list when the page loads
  window.onload = loadStreamerList;
  