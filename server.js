// Dependencies for the application
const fs = require('fs');
const express = require('express');

// Set up app using express
const app = express();

// Create envirment host port
const PORT = process.env.PORT || 3001;

// Link to the "public" folder, create routes to the files under it
// And set up the formatting of express as JSON
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/', (req, res)=>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.listen(PORT, ()=>
    console.log(`App listening at http://localhost:${PORT}`)
)