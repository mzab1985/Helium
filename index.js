



//Import the express dependency
const express = require('express'); 

//Instantiate an express app, the main work horse of this server
const app = express();

const path = require('path');
const expressLayouts = require('express-ejs-layouts');

//Save the port number where your server will be listening
const port = 5000;

//Idiomatic expression in express to route and respond to a client request

//get requests to the root ("/") will route here
//server responds by sending the index.html file to the client's browser
//the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 


// Serve all static files (HTML, CSS, JS, etc.) from the 'public' folder
app.use(express.static('public'));


// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts middleware
app.use(expressLayouts);

// Set the layout file
app.set('layout', 'layout'); // Specify default layout file (layout.ejs)

// Define routes
// Example route
app.get('/', (req, res) => {
    res.render('dashboard'); // No need to specify layout in every view
});

app.get('/dashboard', (req, res) => {        
    res.render('dashboard'); // No need to specify layout in every view
});

app.get('/settings', (req, res) => {
    res.render('settings'); // No need to specify layout in every view
});

app.get('/tables', (req, res) => {
    res.render('tables'); // No need to specify layout in every view
});


//server starts listening for any attempts from a client to connect at port: {port}
app.listen(port, () => {            
    console.log(`Now listening on port ${port}`); 
});