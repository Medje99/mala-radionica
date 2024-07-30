const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', // your frontend URL
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'mala-radionica',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the mySQL database');
});

app.get('/contacts', (req, res) => {
  console.log('Fetching contacts');
  db.query('SELECT * FROM contacts', (err, results) => {
    if (err) {
      console.error('Error retrieving contacts:', err);
      res.status(500).send('Error retrieving contacts');
    } else {
      console.log('Retrieved contacts:', results);
      res.json(results);
    }
  });
});

app.post('/contacts', (req, res) => {
  console.log('POST /contacts called');
  const { firstName, lastName, phoneNumber, city, address, other } = req.body;
  console.log('Received data:', req.body);

  const insertQuery = 'INSERT INTO contacts (firstName, lastName, phoneNumber, city, address, other) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(insertQuery, [firstName, lastName, phoneNumber, city, address, other], (err, result) => {
    if (err) {
      console.error('Error inserting contact:', err);
      res.status(500).json({ error: `Error inserting contact: ${err.message}` });
    } else {
      const selectQuery = 'SELECT * FROM contacts WHERE id = ?';
      db.query(selectQuery, [result.insertId], (err, newContact) => {
        if (err) {
          console.error('Error retrieving new contact:', err);
          res.status(500).json({ error: `Error retrieving new contact: ${err.message}` });
        } else {
          console.log('Newly added contact:', newContact[0]);
          res.json(newContact[0]);
        }
      });
    }
  });
});

app.get('/Products', (req, res) => {
  console.log('Fetching products');
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Error retrieving products:', err);
      res.status(500).send('Error retrieving products');
    } else {
      console.log('Retrieved products:', results);
      res.json(results);
    }
  });
});

app.use((req, res) => {
  console.log(`Undefined route accessed: ${req.method} ${req.url}`);
  res.status(404).send('Route not found');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Middleware Server listening on port ${port}`);
});
