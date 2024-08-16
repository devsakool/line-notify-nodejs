const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3112;

const request = require('request');

const url_line_notification = "https://notify-api.line.me/api/notify";

function sendNotification(message) {
    request({
        method: 'POST',
        uri: url_line_notification,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
            bearer: process.env.TOKEN,
        },
        form: {
            message: message
        },
    }, (err, httpResponse, body) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Notification sent:', body);
        }
    });
}

function runScheduledNotification(hour, minute) {
    const now = new Date();
    const targetTime = new Date();

    targetTime.setHours(hour);
    targetTime.setMinutes(minute);
    targetTime.setSeconds(0);
    
    if (now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1);
    }

    const timeDifference = targetTime - now;

    setTimeout(() => {
        console.log('Time to send notification!');
        callApi();
    }, timeDifference);
}

runScheduledNotification(10, 34);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('PORT from .env:', process.env.PORT);
});

const axios = require('axios');

const callApi = async () => {
    await axios.get("http://localhost:5001/room")
      .then((res) => {
        const currentDate = new Date().toLocaleDateString('th-TH', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        });
        
        const messages = res.data
          .map((room, index) => `\n${index + 1}.ขอใช้ห้อง ${room.ROOM_NAME} : ${room.PERSON_REQUEST_NAME}`)
          .join('\n');
        
        const finalMessage = `วันที่ ${currentDate}\n${messages}`;
        
        sendNotification(finalMessage); 
      })
      .catch((err) => {
        console.error('Error:', err);
      });
  }
