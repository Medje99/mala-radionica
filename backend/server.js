const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); // Load environment variables from .env

const app = express(); // Create an Express application instance

// Specify the allowed origin
const corsOptions = {
  origin: "http://localhost:5173", // frontend localhost:5173
  optionsSuccessStatus: 200,
};

// Apply middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "mala-radionica",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the mySQL database ");
});

// Define a route for handling requests (e.g., GET requests to the /contacts path)
app.get("/contacts", (req, res) => {
  console.log("Fetching contacts");
  db.query("SELECT * FROM contacts", (err, results) => {
    if (err) {
      console.error("Error retrieving contacts:", err);
      res.status(500).send("Error retrieving contacts");
    } else {
      console.log("Retrieved contacts:", results); // Log results
      res.json(results);
    }
  });
});

// Define a route for handling requests (e.g., GET requests to the /Products path)
app.get("/Products", (req, res) => {
  console.log("Fetching products");
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error("Error retrieving products:", err);
      res.status(500).send("Error retrieving products");
    } else {
      console.log("Retrieved products:", results); // Log results
      res.json(results);
    }
  });
});

// Start the server and listen for incoming requests on a specific port (usually 3000)
const port = process.env.PORT || 3000; //
app.listen(port, () => {
  console.log(`Middleware Server listening on port ${port}`);
});
