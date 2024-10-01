// Import the express dependency
const express = require('express');
const router = express.Router();

// Define your routes
router.get('/', (req, res) => {
    res.render('dashboard'); // Render dashboard view
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard'); // Render dashboard view
});

router.get('/settings', (req, res) => {
    res.render('settings'); // Render settings view
});

router.get('/tables', (req, res) => {
    res.render('tables'); // Render tables view
});

// Export the router
module.exports = router;
