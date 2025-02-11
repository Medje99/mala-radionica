const express = require("express"); // Import express
const router = express.Router(); // Create a router instance
const db = require("./db"); // Import your database connection

router.get("/", (req, res) => {
  console.log("Fetching contacts");
  db.query("SELECT * FROM contacts", (err, results) => {
    if (err) {
      console.error("Error retrieving contacts:", err);
      res.status(500).send("Error retrieving contacts");
    } else {
      res.json(results);
      console.log("Retrieved contacts:", results);
    }
  });
});

router.post("/", (req, res) => {
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
          .status(400)
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

router.put("/:id", (req, res) => {
  const contactId = req.params.id;
  const { firstName, lastName, phoneNumber, city, address, other } = req.body;

  // Construct query dynamically to only update provided fields
  let fields = [];
  let values = [];

  const data = { firstName, lastName, phoneNumber, city, address, other };

  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null) {
      fields.push(`${key} = ?`);
      values.push(data[key] === "" ? "" : data[key]); // Keep empty strings as empty
    }
  });

  if (fields.length === 0) {
    return res.status(400).send("No valid fields provided for update.");
  }

  values.push(contactId);

  const query = `UPDATE contacts SET ${fields.join(", ")} WHERE id = ?`;

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating contact:", err);
      return res.status(500).send("Error updating contact");
    } else if (results.affectedRows === 0) {
      return res.status(404).send("Contact not found");
    } else {
      console.log("Contact updated successfully:", results);
      return res.send("Contact updated successfully");
    }
  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  const query = `
    DELETE FROM contacts 
    WHERE id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting contact:", err);
      res.status(500).send("Error deleting contact");
    } else if (results.affectedRows === 0) {
      res.status(404).send("Contact not found");
    } else {
      console.log("Contact deleted successfully:", results);
      res.send("Contact deleted successfully");
    }
  });
});

module.exports = router; // Export the router
