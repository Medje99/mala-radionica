const express = require("express"); // Import express
const router = express.Router(); // Create a router instance
const db = require("./db"); // Import your database connection

//unfinished tasks
router.get("/", (req, res) => {
  console.log("GET /unfinishedTasks called");
  const selectQuery = `
    SELECT 
      t.*,
      c.firstName,
      c.lastName,
      c.phoneNumber
    FROM 
      tasks t
    LEFT JOIN 
      contacts c ON t.contact_id = c.id
    LEFT JOIN 
      bills b ON t.id = b.job_id
    WHERE 
      b.job_id IS NULL;
  `;
  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error("Error retrieving unfinished tasks:", err);
      res.status(500).send("Error retrieving unfinished tasks");
    } else {
      res.json(results);
      console.log("Retrieved unfinished tasks:", results);
    }
  });
});

module.exports = router; // Export the router
