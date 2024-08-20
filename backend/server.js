const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express(); //Create Express instance

//Cross_Origin_Resource_Sharing configuration
const corsOptions = {
  origin: "http://localhost:5173", // your frontend URL:port
  optionsSuccessStatus: 200,
};
//CORS initialize
app.use(cors(corsOptions));
//Body parser initialize
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log("Request body:", req.body);
  next();
});

// SQL create connection instance
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "mala-radionica",
});

// SQL Try connect
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the mySQL database");
});

//Contacts route GET Handler Express

app.get("/contacts", (req, res) => {
  console.log("Fetching contacts");
  db.query("SELECT * FROM contacts", (err, results) => {
    if (err) {
      console.error("Error retrieving contacts:", err);
      res.status(500).send("Error retrieving contacts");
    } else {
      console.log("Retrieved contacts:", results);
      res.json(results);
    }
  });
});

//Contacts route POST Handler Express

app.post("/contacts", (req, res) => {
  console.log("POST /contacts called");
  const { firstName, lastName, phoneNumber, city, address, other } = req.body;
  console.log("Received data:", req.body);

  const insertQuery =
    "INSERT INTO contacts (firstName, lastName, phoneNumber, city, address, other) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    insertQuery,
    [firstName, lastName, phoneNumber, city, address, other],
    (err, result) => {
      if (err) {
        console.error("Error inserting contact:", err);
        res
          .status(500)
          .json({ error: `Error inserting contact: ${err.message}` });
      } else {
        const selectQuery = "SELECT * FROM contacts WHERE id = ?";
        db.query(selectQuery, [result.insertId], (err, newContact) => {
          if (err) {
            console.error("Error retrieving new contact:", err);
            res
              .status(500)
              .json({ error: `Error retrieving new contact: ${err.message}` });
          } else {
            console.log("Newly added contact:", newContact[0]);
            res.json(newContact[0]);
          }
        });
      }
    }
  );
});

//Products route GET Handler Express

app.get("/Products", (req, res) => {
  console.log("Fetching products");
  db.query("SELECT * FROM product", (err, results) => {
    if (err) {
      console.error("Error retrieving products:", err);
      res.status(500).send("Error retrieving products");
    } else {
      console.log("Retrieved products:", results);
      res.json(results);
    }
  });
});

//Products route POST Handler Express
app.post("/ProductInput", (req, res) => {
  console.log("POST /ProductInput called");
  const { name, manufacturer, model, price, quantity } = req.body;
  console.log("Received data:", req.body);

  const insertQuery =
    "INSERT INTO `product` ( `name`, `manufacturer`, `model`, `price`, `quantity`) VALUES ( ?, ?, ?, ?, ?);";
  db.query(
    insertQuery,
    [name, manufacturer, model, price, quantity],
    (err, result) => {
      if (err) {
        console.error("Error inserting product:", err);
        res
          .status(500)
          .json({ error: `Error inserting product: ${err.message}` });
      } else {
        const selectQuery = "SELECT * FROM product WHERE id = ?";
        db.query(selectQuery, [result.insertId], (err, newProduct) => {
          if (err) {
            console.error("Error retrieving new product:", err);
            res
              .status(500)
              .json({ error: `Error retrieving new product: ${err.message}` });
          } else {
            console.log("Newly added product:", newProduct[0]);
            res.json(newProduct[0]);
          }
        });
      }
    }
  );
});

app.put("/Contacts/:id", (req, res) => {
  const contactId = req.params.id;
  const { firstName, lastName, phoneNumber, city, address, other } = req.body;

  if (!firstName || !lastName || !phoneNumber || !city || !address) {
    return res.status(400).send("All required fields must be provided.");
  }

  const query = `
    UPDATE contacts 
    SET firstName = ?, lastName = ?, phoneNumber = ?, city = ?, address = ?, other = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [firstName, lastName, phoneNumber, city, address, other, contactId],
    (err, results) => {
      if (err) {
        console.error("Error updating contact:", err);
        res.status(500).send("Error updating contact");
      } else if (results.affectedRows === 0) {
        res.status(404).send("Contact not found");
      } else {
        console.log("Contact updated successfully:", results);
        res.send("Contact updated successfully");
      }
    }
  );
});



app.put("/Products/:id", (req, res) => {
  const productId = req.params.id;
  const { name, manufacturer, model, price, quantity } = req.body;

  if (!name || !manufacturer || !model || price === undefined || quantity === undefined) {
    return res.status(400).send("All fields must be provided.");
  }

  const query = `
    UPDATE product 
    SET name = ?, manufacturer = ?, model = ?, price = ?, quantity = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [name, manufacturer, model, price, quantity, productId],
    (err, results) => {
      if (err) {
        console.error("Error updating product:", err);
        res.status(500).send("Error updating product");
      } else if (results.affectedRows === 0) {
        res.status(404).send("Product not found");
      } else {
        console.log("Product updated successfully:", results);
        res.send("Product updated successfully");
      }
    }
  );
});

app.get("/Products/:id", (req, res) => {
  const productId = req.params.id;

  const query = `
    SELECT * FROM product WHERE id = ?
  `;

  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error("Error retrieving product:", err);
      res.status(500).send("Error retrieving product");
    } else if (results.length === 0) {
      res.status(404).send("Product not found");
    } else {
      console.log("Product retrieved successfully:", results[0]);
      res.json(results[0]);
    }
  });
});


app.delete("/Products/:id", (req, res) => {
  const productId = req.params.id;

  const query = `
    DELETE FROM product 
    WHERE id = ?
  `;

  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error("Error deleting product:", err);
      res.status(500).send("Error deleting product");
    } else if (results.affectedRows === 0) {
      res.status(404).send("Product not found");
    } else {
      console.log("Product deleted successfully:", results);
      res.send("Product deleted successfully");
    }
  });
});

app.get("/tasks", (req, res) => {
  console.log("GET /tasks called");

  const selectQuery = "SELECT * FROM tasks";

  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error("Error retrieving tasks:", err);
      res.status(500).json({ error: "Error retrieving tasks" });
    } else {
      console.log("Retrieved tasks:", results);
      res.json(results);
    }
  });
});


// Tasks route POST Handler Express
app.post("/task", (req, res) => {
  console.log("POST /task called");
  const { id, contact_id, job_name, job_description, creation_date,} = req.body;
  console.log("Received data:", req.body);

  const insertQuery = 
    "INSERT INTO `tasks` (`id`, `contact_id`, `job_name`, `job_description`,  `creation_date`) VALUES (?, ?, ?, ?,  ?);";
  
  db.query(
    insertQuery,
    [id, contact_id, job_name, job_description,  creation_date],
    (err, result) => {
      if (err) {
        console.error("Error inserting task:", err);
        res
          .status(500)
          .json({ error: `Error inserting task: ${err.message}` });
      } else {
        const selectQuery = "SELECT * FROM tasks WHERE id = ?";
        db.query(selectQuery, [result.insertId], (err, newTask) => {
          if (err) {
            console.error("Error retrieving new task:", err);
            res
              .status(500)
              .json({ error: `Error retrieving new task: ${err.message}` });
          } else {
            console.log("Newly added task:", newTask[0]);
            res.json(newTask[0]);
          }
        });
      }
    }
  );
});

app.get("/tasks/:id", (req, res) => {
  console.log("GET /tasks/:id called");

  const taskId = req.params.id;

  const selectQuery = "SELECT * FROM tasks WHERE id = ?";

  db.query(selectQuery, [taskId], (err, results) => {
    if (err) {
      console.error("Error retrieving task:", err);
      res.status(500).json({ error: "Error retrieving task" });
    } else if (results.length === 0) {
      res.status(404).json({ error: `Task with id ${taskId} not found` });
    } else {
      console.log("Retrieved task:", results[0]);
      res.json(results[0]);
    }
  });
});


// Tasks route PUT Handler Express
// Tasks route PUT Handler Express
app.put("/task/:id", (req, res) => {
  console.log("PUT /task called");
  const { id } = req.params;
  const { contact_id, job_name, job_description, bill_id, creation_date } = req.body;
  console.log("Received data for update:", req.body);

  const updateQuery = 
    "UPDATE `tasks` SET `contact_id` = ?, `job_name` = ?, `job_description` = ?, `bill_id` = ?, `creation_date` = ? WHERE `id` = ?;";
  
  db.query(
    updateQuery,
    [contact_id, job_name, job_description, bill_id, creation_date, id],
    (err, result) => {
      if (err) {
        console.error("Error updating task:", err);
        res
          .status(500)
          .json({ error: `Error updating task: ${err.message}` });
      } else if (result.affectedRows === 0) {
        res
          .status(404)
          .json({ error: `Task with id ${id} not found` });
      } else {
        const selectQuery = "SELECT * FROM tasks WHERE id = ?";
        db.query(selectQuery, [id], (err, updatedTask) => {
          if (err) {
            console.error("Error retrieving updated task:", err);
            res
              .status(500)
              .json({ error: `Error retrieving updated task: ${err.message}` });
          } else {
            console.log("Updated task:", updatedTask[0]);
            res.json(updatedTask[0]);
          }
        });
      }
    }
  );
});

// Tasks route DELETE Handler Express
app.delete("/task/:id", (req, res) => {
  console.log("DELETE /task called");
  const { id } = req.params;

  const deleteQuery = "DELETE FROM `tasks` WHERE `id` = ?";

  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error("Error deleting task:", err);
      res.status(500).json({ error: `Error deleting task: ${err.message}` });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: `Task with id ${id} not found` });
    } else {
      console.log(`Task with id ${id} deleted successfully`);
      res.json({ message: `Task with id ${id} deleted successfully` });
    }
  });
});






app.use((req, res) => {
  console.log(`Undefined route accessed: ${req.method} ${req.url}`);
  res.status(404).send("Route not found");
});

//Start Express Listener process
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Middleware Server listening on port ${port}`);
});
