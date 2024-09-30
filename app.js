//Import the express dependency
const express = require('express'); 

//Instantiate an express app, the main work horse of this server
const app = express();

//Save the port number where your server will be listening
const port = 5000;

//Idiomatic expression in express to route and respond to a client request

//get requests to the root ("/") will route here
//server responds by sending the index.html file to the client's browser
//the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 


// Serve all static files (HTML, CSS, JS, etc.) from the 'public' folder
app.use(express.static('public'));


app.get('/', (req, res) => {        
    res.sendFile('index.html', {root: __dirname});      
                                                        
});

app.get('/dashboard', (req, res) => {        
    res.sendFile('dashboard.html', {root: __dirname});      
});

// Serve dashboard.html when "/dashboard" is requested
app.get('/settings', (req, res) => {
    res.sendFile('settings.html', {root: __dirname});
});

// Serve about.html when "/about" is requested
app.get('/tables', (req, res) => {
    res.sendFile('tables.html', {root: __dirname});
});


//server starts listening for any attempts from a client to connect at port: {port}
app.listen(port, () => {            
    console.log(`Now listening on port ${port}`); 
});