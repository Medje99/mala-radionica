const express = require("express"); // Import express
const router = express.Router(); // Create a router instance
const db = require("./db"); // Import your database connection

router.get("/", (req, res) => {
  console.log("GET /tasks called");

  const selectQuery = `
    SELECT 
      t.*, 
      c.firstName, 
      c.lastName,
      b.bill_id
    FROM 
      tasks t
    LEFT JOIN 
      contacts c ON t.contact_id = c.id
    LEFT JOIN 
      bills b ON t.id = b.job_id;
  `;

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

router.get("/:id", (req, res) => {
  console.log("GET /tasks/:id called");

  const taskId = req.params.id;

  const selectQuery = `
    SELECT 
      t.*, 
      b.bill_id, 
      b.end_date, 
      b.labor_cost, 
      b.paid, 
      b.parts_cost, 
      b.products_used,
      c.firstName,
      c.lastName
    FROM 
      tasks t 
    LEFT JOIN 
      bills b ON t.id = b.job_id 
    LEFT JOIN 
      contacts c ON t.contact_id = c.id
    WHERE 
      t.id = ?;
  `;
  db.query(selectQuery, [taskId], (err, results) => {
    if (err) {
      console.error("Error retrieving task:", err);
      res.status(500).json({ error: "Error retrieving task" });
    } else if (results.length === 0) {
      res.status(404).json({ error: `Task with id ${taskId} not found` });
    } else {
      // Parse products_used from JSON string to an array of objects
      const taskWithBill = results.map((task) => ({
        ...task,
        products_used: task.products_used
          ? JSON.parse(task.products_used)
          : null, // Parse products_used field
      }));

      console.log("Retrieved task with bill:", taskWithBill[0]);
      res.json(taskWithBill[0]);
    }
  });
});

router.post("/", (req, res) => {
  console.log("POST /task called" + req.body);
  const { id, contact_id, job_name, job_description, creation_date } = req.body;
  console.log("/task .post from antd form Received data:", req.body);

  const insertQuery =
    "INSERT INTO `tasks` ( `contact_id`, `job_name`, `job_description`,  `creation_date`) VALUES ( ?, ?, ?,?);";

  db.query(
    insertQuery,
    [contact_id, job_name, job_description, creation_date],
    (err, result) => {
      if (err) {
        console.error("Error inserting task:", err);
        res.status(500).json({ error: `Error inserting task: ${err.message}` });
      } else {
        console.log("sending time as ", creation_date);
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

router.put("/:id", (req, res) => {
  console.log("PUT /task called");
  const { id } = req.params;
  const { contact_id, job_name, job_description, creation_date } = req.body;
  console.log("Received data for update:", req.body);

  const updateQuery =
    "UPDATE `tasks` SET `contact_id` = ?, `job_name` = ?, `job_description` = ?,  `creation_date` = ? WHERE `id` = ?;";

  db.query(
    updateQuery,
    [contact_id, job_name, job_description, creation_date, id],
    (err, result) => {
      if (err) {
        console.error("Error updating task:", err);
        res.status(500).json({ error: `Error updating task: ${err.message}` });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: `Task with id ${id} not found` });
      } else {
        const selectQuery = "SELECT * FROM tasks WHERE id = ?";
        db.query(selectQuery, [id], (err, updatedTask) => {
          if (err) {
            console.error("Error retrieving updated task:", err);
            res.status(500).json({
              error: `Error retrieving updated task: ${err.message}`,
            });
          } else {
            console.log("Updated task:", updatedTask[0]);
            res.json(updatedTask[0]);
          }
        });
      }
    }
  );
});

router.delete("/:id", (req, res) => {
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

module.exports = router; // Export the router
