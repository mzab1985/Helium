// Import the express dependency
const express = require('express');

// Instantiate an express app
const app = express();

const path = require('path');
const expressLayouts = require('express-ejs-layouts');

// Save the port number
const port = 5000;

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts middleware
app.use(expressLayouts);

// Set the layout file
app.set('layout', 'layout');

// Import routes from the routes.js file
const routes = require('./routes');

// Use the routes defined in routes.js
app.use('/', routes);

// Start the server
app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});
