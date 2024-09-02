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

router.put("/:id", (req, res) => {
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
