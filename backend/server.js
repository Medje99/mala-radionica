const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express(); // Create an Express application instance

// Specify the allowed origin
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend's URL
  optionsSuccessStatus: 200,
};

// Apply middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mala-radionica',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Define a route for handling requests (e.g., GET requests to the /contacts path)
app.get('/contacts', (req, res) => {
  console.log('Fetching contacts');
  db.query('SELECT * FROM contacts', (err, results) => {
    if (err) {
      console.error('Error retrieving contacts:', err);
      res.status(500).send('Error retrieving contacts');
    } else {
      console.log('Retrieved contacts:', results); // Log results
      res.json(results);
    }
  });
});

// Start the server and listen for incoming requests on a specific port (usually 3000)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
