const express = require('express');
const router = express.Router();
const Note = require('../models/Notes');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');

// Route 1: Get all the notes using GET "api/notes/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// Route 2: Add notes using POST "api/notes/addnotes"
router.post('/addnotes', fetchuser, [
    body('tittle', 'Please enter a tittle').isLength({ min: 3 }),
    body('description', 'Please enter description').isLength({ min: 5 }),
    body('tag').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { tittle, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            tittle,
            description,
            tag,
            user: req.user.id
        });
        const savedNote = await note.save();
        res.send(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// Route 3: Update notes using PUT "api/notes/updatenotes". Login required
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    try {
        const { tittle, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Create new note object with updated fields
        const newNote = {};
        if (tittle) { newNote.tittle = tittle; }
        if (description) { newNote.description = description; }
        if (tag) { newNote.tag = tag; }

        // Find the note to be updated
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // Check if the authenticated user owns the note
        if (note.user.toString()!== req.user.id) {
            return res.status(401).send("Unauthorized");
        }

        // Update the note in the database and return the updated note
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});


// Route 4: Update notes using DELETE "api/notes/deletenotes". Login required
router.delete('/deletenotes/:id', fetchuser, async (req, res) => {
    try {
        const { tittle, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Find the note to be deleted
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // Check if the authenticated user owns the note
        if (note.user.toString()!== req.user.id) {
            return res.status(401).send("Unauthorized");
        }


        // Delete the note in the database and return the updated note
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "message":"success note has been deleted", note:note });
        
        

    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

module.exports = router;
