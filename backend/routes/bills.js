const express = require("express"); // Import express
const router = express.Router();
const db = require("./db"); // Import your database connection

router.get("/", (req, res) => {
  console.log("GET /bills called");

  const selectQuery = `
    SELECT 
      b.*, 
      c.firstName, 
      c.lastName,
      t.job_name,
      t.job_description,
      t.creation_date
    FROM 
      bills b 
    JOIN 
      contacts c ON b.contact_id = c.id
    LEFT JOIN tasks t ON b.job_id = t.id;

  `;
  db.query(selectQuery, (err, bills) => {
    if (err) {
      console.error("Error retrieving bills:", err);
      res.status(500).json({ error: `Error retrieving bills: ${err.message}` });
    } else {
      // Parse products_used from JSON string to an array of objects
      const billsWithParsedProducts = bills.map((bill) => ({
        ...bill,
        products_used: JSON.parse(bill.products_used), // Parse products_used field
      }));

      console.log(
        "Retrieved bills with parsed products_used:",
        billsWithParsedProducts
      );
      res.json(billsWithParsedProducts);
    }
  });
});

router.post("/", (req, res) => {
  console.log("POST /bill called");
  const {
    contact_id,
    job_id,
    end_date,
    labor_cost,
    paid,
    parts_cost,
    products_used,
  } = req.body;
  console.log("Received data:", req.body);

  // Convert products_used to a JSON string before inserting
  const productsUsedJson = JSON.stringify(products_used);

  const insertQuery =
    "INSERT INTO `bills` (`contact_id`, `job_id`, `end_date`, `labor_cost`, `paid`, `parts_cost`, `products_used`) VALUES (?, ?, ?, ?, ?, ?, ?);";
  db.query(
    insertQuery,
    [
      contact_id,
      job_id,
      end_date,
      labor_cost,
      paid,
      parts_cost,
      productsUsedJson,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting bill:", err);
        res.status(500).json({ error: `Error inserting bill: ${err.message}` });
      } else {
        const selectQuery = "SELECT * FROM bills WHERE bill_id = ?";
        db.query(selectQuery, [result.insertId], (err, newBill) => {
          if (err) {
            console.error("Error retrieving new bill:", err);
            res
              .status(500)
              .json({ error: `Error retrieving new bill: ${err.message}` });
          } else {
            console.log("Newly added bill:", newBill[0]);
            res.json(newBill[0]);
          }
        });
      }
    }
  );
});

router.put("/:bill_id", (req, res) => {
  const billId = req.params.bill_id;
  const {
    contact_id,
    job_id,
    job_name,
    end_date,
    labor_cost,
    paid,
    parts_cost,
    products_used,
  } = req.body;

  // Validate required fields
  if (
    !job_name ||
    !contact_id ||
    !job_id ||
    !end_date ||
    labor_cost === undefined ||
    parts_cost === undefined
  ) {
    return res.status(400).send("All required fields must be provided.");
  }

  // Convert products_used to JSON string
  const productsUsedJson = JSON.stringify(products_used);

  // Update bills table
  const updateBillQuery = `
    UPDATE bills 
    SET contact_id = ?, end_date = ?, labor_cost = ?, paid = ?, parts_cost = ?, products_used = ?
    WHERE bill_id = ?
  `;

  db.query(
    updateBillQuery,
    [
      contact_id,
      end_date,
      labor_cost,
      paid,
      parts_cost,
      productsUsedJson,
      billId,
    ],
    (err, billResults) => {
      if (err) {
        console.error("Error updating bill:", err);
        return res.status(500).send("Error updating bill");
      } else if (billResults.affectedRows === 0) {
        return res.status(404).send("Bill not found");
      }

      // Update tasks table
      const updateTaskQuery = `
        UPDATE tasks
        SET job_name = ?
        WHERE id = ?
      `;

      db.query(updateTaskQuery, [job_name, job_id], (err, taskResults) => {
        if (err) {
          console.error("Error updating task:", err);
          return res.status(500).send("Error updating task");
        } else if (taskResults.affectedRows === 0) {
          return res.status(404).send("Task not found");
        }

        console.log("Bill and task updated successfully");
        res.send("Bill and task updated successfully");
      });
    }
  );
});

router.delete("/:id", (req, res) => {
  const billId = req.params.id;

  const query = `
    DELETE FROM bills 
    WHERE bill_id = ?
  `;

  db.query(query, [billId], (err, results) => {
    if (err) {
      console.error("Error deleting Bill:", err);
      res.status(500).send("Error deleting Bill");
    } else if (results.affectedRows === 0) {
      res.status(404).send("Bill not found");
    } else {
      console.log("Bill deleted successfully:", results);
      res.send("Bill deleted successfully");
    }
  });
});

module.exports = router; // Export the router
