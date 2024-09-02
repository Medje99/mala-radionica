const express = require("express"); // Import express
const cors = require("cors"); // Import cors
const bodyParser = require("body-parser"); // Import body-parser
require("dotenv").config(); // import dotenv
const db = require("./routes/db"); // Import your database connection
const app = express(); //Create Express instance

//Cross_Origin_Resource_Sharing configuration
const corsOptions = {
  origin: "http://localhost:5173", // your frontend URL:port
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Products route
const productsRoutes = require("./routes/products"); // Import the products router
app.use("/products", productsRoutes); // Use the products router

//Contacts route
const contactsRoutes = require("./routes/contacts"); // Import the contacts router
app.use("/contacts", contactsRoutes); // Use the contacts router

//Bills route
const billsRoutes = require("./routes/bills"); // Import the bills router
app.use("/bills", billsRoutes); // Use the bills router

//Tasks route
const tasksRoutes = require("./routes/tasks"); // Import the tasks router
app.use("/tasks", tasksRoutes); // Use the tasks router

//Unfinished tasks route
const unfinishedTasksRoutes = require("./routes/unfinishedTasks"); // Import the unfinished tasks router
app.use("/unfinishedTasks", unfinishedTasksRoutes); // Use the unfinished tasks router

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
app.listen(port, () => {
  console.log(`Middleware Server listening on port ${port}`);
});
