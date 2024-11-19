// storage.js

import {addNoteToMenu} from '../main.js';
import { getTitle, getContent } from './utils.js';

let storedNotesArr = [];

// Local storage of unsaved user input
const AUTO_SAVE_KEY = "temporaryNote";
/* export let temporaryNote = JSON.parse(localStorage.getItem(AUTO_SAVE_KEY)); //? not needed? */

const TEMPORARY_NOTE_ID = "temporaryNoteID"; 
const TEMPORARY_NOTE_DATE = new Date().toLocaleString();
if (!localStorage.getItem(AUTO_SAVE_KEY)) {
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify({ title: "", content: "", dateAndTime: TEMPORARY_NOTE_DATE, uniqueID: TEMPORARY_NOTE_ID }));
}


function storeTemporaryNote () {
    const TITLE = getTitle();
    const CONTENT = getContent();
    const UNIQUE_ID = TEMPORARY_NOTE_ID;
    const DATE = new Date().toLocaleString();

    try {
        localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify({ title: TITLE, content: CONTENT, uniqueID: UNIQUE_ID, dateAndTime: DATE }));
    } catch (error) {
        console.error("Error storing temporary note:", error);
    }

}


function getAutoSavedNote() {
    try {
        const savedNote = JSON.parse(localStorage.getItem(AUTO_SAVE_KEY));
        if (savedNote) {
            // Populate the form fields with the saved values
            document.getElementById("title").value = savedNote.title || "";
            document.getElementById("content").value = savedNote.content || "";
        }
    } catch (error) {
        console.error("Error parsing auto-saved note:", error);
    }
}


function clearAllSavedNotes() {
    localStorage.clear();
    storedNotesArr = [];
    addNoteToMenu();
}

function loadNotes() { // Load all stored notes into array and post them to the menu
    storedNotesArr = [];
    Object.keys(localStorage).forEach(key => {
        if (key !== "storedNotesArr") {
            try {
                const note = JSON.parse(localStorage.getItem(key));
                storedNotesArr.push(note);
            } catch (error) {
                console.error(`Error parsing note with key ${key}:`, error);
            }
        }
        addNoteToMenu();
    });
    
}

function deleteNoteByID(uniqueID) {
    localStorage.removeItem(uniqueID);
    storedNotesArr = storedNotesArr.filter(note => note.uniqueID !== uniqueID);
    addNoteToMenu();
    console.log("Deleted note:", uniqueID);
}

export { storeTemporaryNote, getAutoSavedNote, clearAllSavedNotes, loadNotes, deleteNoteByID, storedNotesArr, AUTO_SAVE_KEY } 

