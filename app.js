const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

// ---------------------------
// 1. DATABASE CONNECTION
// ---------------------------
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",   // mets ton mot de passe MySQL ici
  database: "my_database"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
    return;
  }

  console.log("Connected to MySQL!");

  const createTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255)
    )
  `;
  db.query(createTable);
});



// CREATE → POST /add
app.post("/add", (req, res) => {
  const { name, email } = req.body;
  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
  db.query(sql, [name, email], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "User added!", id: result.insertId });
  });
});


app.get("/records", (req, res) => {
  db.query("SELECT * FROM users", (err, rows) => {
    if (err) return res.status(500).send(err);
    res.send(rows);
  });
});


app.get("/record/:id", (req, res) => {
  db.query("SELECT * FROM users WHERE id = ?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).send(err);
    res.send(rows[0] || {});
  });
});

app.put("/update/:id", (req, res) => {
  const { name, email } = req.body;
  const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
  db.query(sql, [name, email, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "User updated!" });
  });
});

app.delete("/delete/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "User deleted!" });
  });
});

// ---------------------------
// 3. START SERVER
// ---------------------------
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
