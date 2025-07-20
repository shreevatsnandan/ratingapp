const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/users", (req, res) => {
  const { name, email, address, role } = req.query;
  let sql = "SELECT * FROM users WHERE 1=1";
  const params = [];

  if (name) {
    sql += " AND name LIKE ?";
    params.push(`%${name}%`);
  }
  if (email) {
    sql += " AND email LIKE ?";
    params.push(`%${email}%`);
  }
  if (address) {
    sql += " AND address LIKE ?";
    params.push(`%${address}%`);
  }
  if (role) {
    sql += " AND role = ?";
    params.push(role);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});



router.get('/store-rating/:id', (req, res) => {
  const storeUserId = req.params.id;

  db.query(
    'SELECT AVG(rating) as averageRating, COUNT(*) as totalRatings FROM ratings WHERE store_user_id = ?',
    [storeUserId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      const { averageRating, totalRatings } = results[0];
      res.json({
        averageRating: averageRating || 0,
        totalRatings: totalRatings || 0,
      });
    }
  );
});

router.get('/stores', (req, res) => {
  const reviewer_user_id = req.query.user_id;

  const sql = `
    SELECT u.id, u.name, u.address,
      ROUND(AVG(r.rating), 1) AS average_rating,
      (SELECT rating FROM ratings WHERE reviewer_user_id = ? AND store_user_id = u.id) AS user_rating
    FROM users u
    LEFT JOIN ratings r ON u.id = r.store_user_id
    WHERE u.role = 'storeowner'
    GROUP BY u.id
  `;

  db.query(sql, [reviewer_user_id], (err, results) => {
    if (err) {
      console.error('Error fetching stores:', err);
      return res.status(500).json({ message: 'DB error' });
    }
    res.status(200).json(results);
  });
});


router.post('/addRating', (req, res) => {
  const { store_user_id, reviewer_user_id, rating } = req.body;

  const checkSql = "SELECT * FROM ratings WHERE store_user_id = ? AND reviewer_user_id = ?";
  db.query(checkSql, [store_user_id, reviewer_user_id], (err, results) => {
    if (err) {
      console.error("Check rating error:", err);
      return res.status(500).json({ message: "DB error on check" });
    }

    if (results.length > 0) {
      const updateSql = "UPDATE ratings SET rating = ? WHERE store_user_id = ? AND reviewer_user_id = ?";
      db.query(updateSql, [rating, store_user_id, reviewer_user_id], (updateErr) => {
        if (updateErr) {
          console.error("Rating update error:", updateErr);
          return res.status(500).json({ message: "Failed to update rating" });
        }
        return res.status(200).json({ message: "Rating updated" });
      });
    } else {
      const insertSql = "INSERT INTO ratings (store_user_id, reviewer_user_id, rating) VALUES (?, ?, ?)";
      db.query(insertSql, [store_user_id, reviewer_user_id, rating], (insertErr) => {
        if (insertErr) {
          console.error("Rating insert error:", insertErr);
          return res.status(500).json({ message: "Failed to submit rating" });
        }
        return res.status(200).json({ message: "Rating submitted" });
      });
    }
  });
});

router.get('/ratings/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  const sql = "SELECT store_user_id, rating FROM ratings WHERE reviewer_user_id = ?";
  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching user ratings:", err);
      return res.status(500).json({ message: "DB error" });
    }

    res.status(200).json(results);
  });
});

router.post('/update-password', (req, res) => {
  const { userId, newPassword } = req.body;

  const sql = 'UPDATE users SET password = ? WHERE id = ?';
  db.query(sql, [newPassword, userId], (err) => {
    if (err) {
      console.error('Password update error:', err);
      return res.status(500).json({ message: 'Error updating password' });
    }

    res.status(200).json({ message: 'Password updated successfully' });
  });
});


router.get("/dashboard", async (req, res) => {
  try {
    const [userCountResult] = await db.query("SELECT COUNT(*) AS totalUsers FROM users WHERE role = 'user'");
    const [storeCountResult] = await db.query("SELECT COUNT(*) AS totalStores FROM users WHERE role = 'storeowner'");
    const [ratingCountResult] = await db.query("SELECT COUNT(*) AS totalRatings FROM ratings");
console.log(userCountResult)
    res.json({
      totalUsers: userCountResult[0].totalUsers,
      totalStores: storeCountResult[0].totalStores,
      totalRatings: ratingCountResult[0].totalRatings
    });
  } catch (err) {
    console.error("Error fetchhing stats:", err);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

module.exports = router;
