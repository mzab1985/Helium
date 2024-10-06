// Import the express dependency
const express = require('express');
const router = express.Router();

// Define your routes with layouts.
// specifying the layout explicitly in the route (e.g., layout: 'layout_alt') is necessary 
// because the layout is rendered server-side. This allows the server to decide which layout (template structure) 
// to use before sending the page to the client

router.get('/', (req, res) => {
    res.render('dashboard', { layout: 'layout' }); // Render dashboard view
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard', { layout: 'layout' }); // Render dashboard view
});

router.get('/settings', (req, res) => {
    res.render('settings', { layout: 'layout' }); // Render settings view
});

router.get('/tables', (req, res) => {
    res.render('tables', { layout: 'layout_alt' }); // Render tables view
});

router.get('/login', (req, res) => {
    res.render('login', { layout: 'layout_full' }); 
});

router.get('/register', (req, res) => {
    res.render('register', { layout: 'layout_full' }); 
});

router.get('/profile', (req, res) => {
    res.render('profile', { layout: 'layout_full' }); 
});

router.get('/landing', (req, res) => {
    res.render('landing', { layout: 'layout_full' }); 
});


// Export the router
module.exports = router;
