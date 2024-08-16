const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv');
const mysql = require('mysql2');
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// ตรวจสอบการเชื่อมต่อ
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

var app = express()
app.use(cors())
app.use(express.json())

app.listen(5001, function () {
  console.log('CORS-enabled web server listening on port 5001')
})


app.get('/room', function (req, res, next) {
  connection.query(
    `SELECT * 
    FROM room_service rs 
    LEFT OUTER JOIN room_index ri ON rs.ROOM_ID=ri.room_id`,
    function(err, results, fields) {
      if (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database query failed' });
        return;
      }
      res.json(results);
    }
  );
})



