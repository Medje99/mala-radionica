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

  // Destructure required fields from request body
  const { contact_id, job_id, end_date, labor_cost, paid, products_used } =
    req.body;

  // Check if required data is provided
  if (!contact_id || !job_id || !products_used) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Calculate total parts cost by summing the price per product
  const parts_cost = products_used.reduce((acc, product) => {
    return acc + product.quantity * product.price;
  }, 0);

  // Calculate total cost
  const total_cost = parts_cost + labor_cost;

  // Convert `products_used` array to JSON format with necessary details
  const productsUsedJson = JSON.stringify(
    products_used.map((product) => ({
      product_id: product.product_id,
      name: product.name, // Product name
      manufacturer: product.manufacturer, // Product manufacturer
      quantity: product.quantity, // Quantity used
      total_price: product.quantity * product.price, // Total price for this product
    }))
  );

  const insertQuery =
    "INSERT INTO `bills` (`contact_id`, `job_id`, `end_date`, `labor_cost`, `paid`, `parts_cost`, `products_used`, `total_cost`) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";

  // Execute the insert query
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
      total_cost,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting bill:", err);
        return res
          .status(500)
          .json({ error: `Error inserting bill: ${err.message}` });
      }

      // Retrieve the newly added bill for confirmation
      const selectQuery = "SELECT * FROM bills WHERE bill_id = ?";
      db.query(selectQuery, [result.insertId], (err, newBill) => {
        if (err) {
          console.error("Error retrieving new bill:", err);
          return res
            .status(500)
            .json({ error: `Error retrieving new bill: ${err.message}` });
        }

        // Log the newly added bill and return it in the response
        console.log("Newly added bill:", newBill[0]);
        res.json(newBill[0]);
      });
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
  const missingFields = [];
  if (!job_name) missingFields.push("job_name");
  if (!contact_id) missingFields.push("contact_id");
  if (!job_id) missingFields.push("job_id");
  if (!end_date) missingFields.push("end_date");
  if (labor_cost === undefined) missingFields.push("labor_cost");
  if (parts_cost === undefined) missingFields.push("parts_cost");

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ error: `Missing required fields: ${missingFields.join(", ")}` });
  }

  // Convert products_used to JSON string if it exists
  const productsUsedJson = products_used ? JSON.stringify(products_used) : null;

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
        return res.status(500).json({
          error: "Internal server error while updating bill",
          details: err.message,
        });
      } else if (billResults.affectedRows === 0) {
        return res.status(404).json({ error: "Bill not found" });
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
          return res.status(500).json({
            error: "Internal server error while updating task",
            details: err.message,
          });
        } else if (taskResults.affectedRows === 0) {
          return res.status(404).json({ error: "Task not found" });
        }

        console.log("Bill and task updated successfully");
        res.json({ message: "Bill and task updated successfully" });
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
