// routes/storeOwner.js
const express = require('express');
const router = express.Router();
const db = require("../config/db"); // now uses mysql2/promise

router.get('/ratings', async (req, res) => {
  try {
    const storeOwnerId = req.id || 1;

    const [ratings] = await db.query(
      `SELECT 
         r.rating, 
         r.created_at,
         u.name AS reviewer_name
       FROM ratings r
       JOIN users u ON r.reviewer_user_id = u.id
       WHERE r.store_user_id = ?
       ORDER BY r.created_at DESC`,
      [storeOwnerId]
    );
console.log(ratings);
    const avgRating =
      ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2)
        : null;

    res.json({
      averageRating: avgRating,
      totalRatings: ratings.length,
      ratings,
    });
  } catch (err) {
    console.error('Error fetching ratings:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
