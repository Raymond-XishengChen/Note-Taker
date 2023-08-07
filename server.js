// Dependencies for the application
const fs = require('fs');
const express = require('express');
const path = require('path');

// Set up app using express
const app = express();

// Create envirment host port
const PORT = process.env.PORT || 3001;

// Use random IDs for each note entry
const { v4: uuidv4 } = require('uuid');

// Link to the "public" folder, create routes to the files under it
// And set up the formatting of express as JSON
app.use(express.static('public'));
app.use(express.json());

// Get route for the home page
app.get('/', (req, res)=>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Get route for the notes page
app.get('/notes', (req, res)=>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Read the notes from db.json list
app.get('/api/notes', (req, res) =>{
    fs.readFile(path.join(__dirname, './db/db.json'), (error, data) => {
        // Log error if there's any
        if (error) {
            console.error(error);
        }
        // Otherwise return data from the database
        res.json(JSON.parse(data));
    })
});

// GET specific note from saved list
app.get('/api/notes/:id', (req,res) => {

    // Get the target note's ID
    const note_ID = req.params.id;

    // Read the selected note content from database
    fs.readFile((path.join(__dirname, './db/db.json')),(error, data) => {
        if (error){
            console.error(error);
        } else {
            // Compare and return when ID matches the selected note
            // and there is content saved for the specific note
            const result = json.filter((note) => note.id === note_ID);
            return result.length > 0
            ? res.json(result)
            : res.json('No content is saved')
        }
    })
})

// Post action, writing new notes to list and save to database
app.post('/api/notes', (req, res)=> {
    const { title, text, id } = req.body;

    if (req.body){

        // Construct the new note with a title, text, and a randomised ID for filtering purpose
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        // Read the database, grabbing all the notes
        fs.readFile((path.join(__dirname, './db/db.json')),(error, data) => {
            if (error){
                console.error(error);
            } else {

                // Parse the new note and push the content of the new note to the existing list
                const parsedData = JSON.parse(data);
                parsedData.push(newNote);

                // Write the new list into the database file
                fs.writeFile((path.join(__dirname, './db/db.json')), JSON.stringify(parsedData), (error)=> {
                    if(error){
                        console.error(error);
                    } else {
                        console.log(`\nData written to database successfully!`);
                    }
                });

                // Update the list at the webpage
                res.json(newNote);
            }
        })
    }
})



// Delete action, deleting a note from the list and update at the webpage
app.delete('/api/notes/:id', (req, res) =>{
    // Get the ID of the specific note
    const note_ID = req.params.id;

    // Read from the saved list
    fs.readFile((path.join(__dirname, './db/db.json')),(error, data) => {
        if (error){
            console.error(error)
        } else {

            // Filter out the selected note 
            const parsedData =JSON.parse(data);
            const result = parsedData.filter((note) => note.id !== note_ID);

            // Save the updated list back to database
            fs.writeFile((path.join(__dirname, './db/db.json')), JSON.stringify(result), (error)=> {
                if(error){
                    console.error(error);
                } else {
                    console.log(`\nUpdated data written to database successfully!`);
                }
            });
            // Update the list at webpage
            res.json(result);
        } 
    })
})


app.listen(PORT, ()=>
    console.log(`App listening at http://localhost:${PORT}`)
)