const express = require("express"); // Import express
const router = express.Router(); // Create a router instance
const db = require("./db"); // Import your database connection

router.get("/unique-manufacturers", (req, res) => {
  db.query("SELECT DISTINCT manufacturer FROM product", (err, results) => {
    if (err) {
      console.error("Error retrieving unique manufacturers:", err);
      res.status(500).send("Error retrieving unique manufacturers");
    } else {
      // Extract manufacturer names from the result rows
      const manufacturers = results.map((row) => row.manufacturer);
      console.log("Retrieved unique manufacturers:", manufacturers);
      res.json(manufacturers);
    }
  });
});

router.get("/", (req, res) => {
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

router.get("/:id", (req, res) => {
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

router.post("/", (req, res) => {
  console.log("POST /ProductInput called");
  const { name, manufacturer, model, price, quantity, SKU } = req.body;
  console.log("Received data:", req.body);

  const insertQuery =
    "INSERT INTO product (name, manufacturer, model, price, quantity, SKU) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    insertQuery,
    [name, manufacturer, model, price, quantity, SKU],
    (err, result) => {
      if (err) {
        console.error("Error inserting product:", err);
        res.status(400).json({ error: `Error inserting product: ${err}` });
      } else {
        // Get the newly inserted product by its ID
        const selectQuery = "SELECT * FROM product WHERE id = ?";
        db.query(selectQuery, [result.insertId], (err, newProduct) => {
          if (err) {
            console.error("Error retrieving new product:", err);
            res.status(500).json({
              error: `Error retrieving new product: ${err.message}`,
            });
          } else {
            console.log("Newly added product:", newProduct[0]);
            res.json(newProduct[0]); // Send the new product as a response
          }
        });
      }
    }
  );
});

router.put("/:id", (req, res) => {
  const productId = req.params.id;
  const { name, manufacturer, model, price, quantity, SKU } = req.body;

  if (
    !name ||
    price === undefined ||
    quantity === undefined ||
    SKU === undefined
  ) {
    return res.status(400).send("All fields must be provided.");
  }

  // Update product based on id
  const query = `
    UPDATE product 
    SET name = ?, manufacturer = ?, model = ?, price = ?, quantity = ?, SKU = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [name, manufacturer, model, price, quantity, SKU, productId],
    (err, results) => {
      if (err) {
        console.error("Error updating product:", err);
        res.status(500).send(err);
      } else if (results.affectedRows === 0) {
        res.status(404).send("Product not found");
      } else {
        console.log("Product updated successfully:", results);
        res.send("Product updated successfully");
      }
    }
  );
});

router.delete("/:id", (req, res) => {
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

module.exports = router;
