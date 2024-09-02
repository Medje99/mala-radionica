// products.js
const express = require("express");
const router = express.Router();
const db = require("./db"); // Adjust the path to your actual database module

// Handler function to subtract quantities
router.post("/", (req, res) => {
  const products = req.body; // Expecting an array of objects with product id and quantity

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: "Invalid input" });
  }

  // Start by creating an array of promises for each update
  const updatePromises = products.map((item) => {
    const productId = item.product;
    const quantity = parseInt(item.quantity, 10);

    if (isNaN(quantity) || quantity < 0) {
      return Promise.reject(
        new Error(`Invalid quantity for product ID ${productId}`)
      );
    }

    // Fetch the current quantity of the product
    const fetchProductPromise = new Promise((resolve, reject) => {
      db.query(
        "SELECT quantity FROM product WHERE id = ?",
        [productId],
        (err, results) => {
          if (err) {
            reject(new Error("Error retrieving product"));
          } else if (results.length === 0) {
            reject(new Error(`Product with ID ${productId} not found`));
          } else {
            const currentQuantity = results[0].quantity;
            if (currentQuantity < quantity) {
              reject(
                new Error(`Insufficient stock for product ID ${productId}`)
              );
            } else {
              resolve(currentQuantity);
            }
          }
        }
      );
    });

    // Update the product quantity
    const updateProductPromise = fetchProductPromise.then((currentQuantity) => {
      return new Promise((resolve, reject) => {
        db.query(
          "UPDATE product SET quantity = ? WHERE id = ?",
          [currentQuantity - quantity, productId],
          (err, results) => {
            if (err) {
              reject(new Error("Error updating product"));
            } else {
              resolve();
            }
          }
        );
      });
    });

    return updateProductPromise;
  });

  // Execute all update promises and handle results
  Promise.all(updatePromises)
    .then(() => {
      res.status(200).json({ message: "Quantities updated successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
