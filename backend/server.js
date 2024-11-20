const express = require("express"); // Import express
const cors = require("cors"); // Import cors
const bodyParser = require("body-parser"); // Import body-parser
require("dotenv").config(); // import dotenv
const db = require("./routes/db"); // Import your database connection
const app = express(); //Create Express instance

//Cross_Origin_Resource_Sharing configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:5173', 'http://192.168.8.157:5173']; // Add other allowed origins if needed
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) { // Allow listed origins and requests with no origin (like Postman)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};


app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Products route
const productsRoutes = require("./routes/products");
app.use("/products", productsRoutes);

//Contacts route
const contactsRoutes = require("./routes/contacts");
app.use("/contacts", contactsRoutes);

//Contacts route
const quantitySubtract = require("./routes/product-q-update");
app.use("/quantitySubtract", quantitySubtract);

//Bills route
const billsRoutes = require("./routes/bills");
app.use("/bills", billsRoutes);

//Tasks route
const tasksRoutes = require("./routes/tasks");
app.use("/tasks", tasksRoutes);

//Unfinished tasks route
const unfinishedTasksRoutes = require("./routes/unfinishedTasks");
app.use("/unfinishedTasks", unfinishedTasksRoutes);

//Middleware for logging incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log("Request body:", req.body);
  next();
});

// Error handling middleware
app.use((req, res) => {
  console.log(`Undefined route accessed: ${req.method} ${req.url}`);
  res.status(404).send("Route not found");
});

//Start Express Listener process
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {  // <-- Add '0.0.0.0' here
  console.log(`Middleware Server listening on port ${port}`);
});

