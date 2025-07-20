const express = require("express");
const router = express.Router();
const db = require("../config/db");
const md5 = require('js-md5');

router.post("/addUser", (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password || !address || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }
console.log(req.body)
  const sql = `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`;
let password1 = md5(password);
  db.query(sql, [name, email, password1, address, role], (err, result) => {
    if (err) {
      console.error("Error inserting user:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(201).json({ message: "User created successfully" });
  });
});

module.exports = router;
