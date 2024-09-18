// Handler function to subtract quantities
// products.js
const express = require("express");
const router = express.Router();
const db = require("./db");

// Handler function to subtract quantities
router.post("/", (req, res) => {
  const products = req.body; // Expecting an array of objects with product id and quantity

  // Validate input: Ensure products is an array and not empty
  if (!Array.isArray(products) || products.length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid input: 'products' should be a non-empty array" });
  }

  // Start by creating an array of promises for each update
  const updatePromises = products.map((product) => {
    // Extract product_id and quantity, ensuring they are numbers
    const product_id = parseInt(product.product_id, 10);
    const quantity = parseInt(product.quantity, 10);

    // Input validation for each product
    if (isNaN(product_id) || product_id <= 0) {
      return Promise.reject(
        new Error(`Invalid product_id: ${product.product_id}`)
      );
    }
    if (isNaN(quantity) || quantity <= 0) {
      return Promise.reject(
        new Error(
          `Invalid quantity for product ID ${product_id}: ${product.quantity}`
        )
      );
    }

    // Fetch the current quantity of the product
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT quantity FROM product WHERE id = ?",
        [product_id],
        (err, results) => {
          if (err) {
            reject(
              new Error(
                `Error retrieving product with ID ${product_id}: ${err.message}`
              )
            );
          } else if (results.length === 0) {
            reject(new Error(`Product with ID ${product_id} not found`));
          } else {
            const currentQuantity = results[0].quantity;
            if (currentQuantity < quantity) {
              reject(
                new Error(
                  `Insufficient stock for product ID ${product_id}. Requested: ${quantity}, Available: ${currentQuantity}`
                )
              );
            } else {
              // Update the product quantity
              db.query(
                "UPDATE product SET quantity = ? WHERE id = ?",
                [currentQuantity - quantity, product_id],
                (err, updateResults) => {
                  if (err) {
                    reject(
                      new Error(
                        `Error updating product with ID ${product_id}: ${err.message}`
                      )
                    );
                  } else {
                    resolve(); // Resolve the promise if the update was successful
                  }
                }
              );
            }
          }
        }
      );
    });
  });

  // Execute all update promises and handle results
  Promise.all(updatePromises)
    .then(() => {
      res.status(200).json({ message: "Quantities updated successfully" });
    })
    .catch((error) => {
      console.error("Error updating quantities:", error); // Log the error for debugging
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
