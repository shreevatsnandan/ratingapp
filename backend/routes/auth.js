const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "admin1234567890";

router.post('/login', (req, res) => {
  const { email, password1 } = req.body;
  console.log(req.body);

  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';

  db.query(sql, [email, password1], (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    console.log(results);

    if (results.length > 0) {
      const user = results[0];

      // ✅ Generate JWT token with id and role
       const token = jwt.sign(
        { id: user.id, role: user.role },
        secretKey,
        { expiresIn: '1d' }
      );

      // ✅ Send token and role back
      res.status(200).json({
        message: 'Login successful',
        role: user.role,
        token: token,
        id: user.id
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});


module.exports = router;
