const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const ONE_SIGNAL_APP_ID = '3df8abfb-174c-4e02-9d80-5f7e54ab76e4';
const ONE_SIGNAL_API_KEY = 'os_v2_app_hx4kx6yxjrhafhmal57fjk3w4rrqv24lbjmel3fnaodxdpphgjqbncnwj7zvrdvuznos5zjs2gdcm7ogzlkp6im6ppr2cbjw5if4iaq';

// 🎯 Send notification directly to specific device
app.post('/schedule-notification', async (req, res) => {
  const { meetingTitle, meetingTime, playerId } = req.body;

  const scheduleTime = new Date(meetingTime - 2 * 60 * 60 * 1000).toISOString(); // قبل ساعتين

  const notification = {
    app_id: ONE_SIGNAL_APP_ID,
    headings: { en: 'Meeting Reminder' },
    contents: { en: `Your meeting "${meetingTitle}" starts in 2 hours` },
    include_player_ids: [playerId],
    send_after: scheduleTime
  };

  try {
    const response = await axios.post('https://onesignal.com/api/v1/notifications', notification, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${ONE_SIGNAL_API_KEY}`,
      },
    });

    console.log("✅ OneSignal response:", response.data);
    res.status(200).json({ success: true, response: response.data });
  } catch (error) {
    console.error("❌ OneSignal error:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Failed to send notification' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
