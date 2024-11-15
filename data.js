import { getTitle, getContent, getCategory, addNoteToMenu} from './ui.js';
import { generateUniqueID } from './utils.js';
import { updateNoteData } from './data.js';

// Global variables
export let storedNotesArr = [];
export let editingNoteID = null;


export function addNote() {
    const title = getTitle();
    const content = getContent();
    const uniqueID = generateUniqueID();
    const dateAndTime = new Date().toLocaleString();
    const categories = getCategory();
    const note = { title, content, uniqueID, dateAndTime, categories };

    storedNotesArr.push(note);
    localStorage.setItem(uniqueID, JSON.stringify(note));

    return note;
}



export function clearAllSavedNotes() {
    localStorage.clear();
    storedNotesArr = [];
    addNoteToMenu();
}

export function createNewNote() {
    editingNoteID = null;
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
    document.getElementById("date").innerText = "";
    document.getElementById("noteID").innerText = "";

    // Clear all category checkboxes
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    console.log("Created a new note.");
}


export function deleteNoteByID(uniqueID) {
    localStorage.removeItem(uniqueID);
    storedNotesArr = storedNotesArr.filter(note => note.uniqueID !== uniqueID);
    addNoteToMenu();
    console.log("Deleted note:", uniqueID);
}

export function fetchNoteByID(uniqueID) {
    const note = storedNotesArr.find(note => note.uniqueID === uniqueID); // find the associated note
    if (!note) return console.error("Note not found!"); // return if note is not found

    document.getElementById("title").value = note.title;
    document.getElementById("content").value = note.content;
    document.getElementById("date").innerText = note.dateAndTime;
    document.getElementById("noteID").innerText = note.uniqueID;
    
    // Clear any previous selections
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // !Check only the categories associated with the note
    if (note.categories) {
        note.categories.forEach(category => {
            const checkbox = document.querySelector(`input[name="category"][value="${category}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    
    editingNoteID = uniqueID;
}

export function getAutoSavedNote() {
    const savedNote = JSON.parse(localStorage.getItem(AUTO_SAVE_KEY));
    if (savedNote) {
        // Populate the form fields with the saved values
        document.getElementById("title").value = savedNote.title || "";
        document.getElementById("content").value = savedNote.content || "";
    }
}

export function storeTemporaryNote () {
    const TITLE = getTitle();
    const CONTENT = getContent();

    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify({ title: TITLE, content: CONTENT }));

}


export function saveCurrentNote() {
    let storedNote;

    if (editingNoteID) {
        // Edit the existing note
        storedNote = updateNoteData();
    } else {
        // Create a new note
        storedNote = addNote();
        editingNoteID = storedNote.uniqueID;
    }

    // Update the date and ID display
    document.getElementById("date").innerText = storedNote.dateAndTime;
    document.getElementById("noteID").innerText = storedNote.uniqueID;

    // Clear the temporary note
    localStorage.removeItem(AUTO_SAVE_KEY);

    // Refresh the notes list
    addNoteToMenu();

    console.log("Stored note:", storedNote);
 
}

export function updateNoteData() {
    const note = storedNotesArr.find(note => note.uniqueID === editingNoteID);
    if (!note) {
        console.error("No note to update!");
        return null;
    }

    note.title = getTitle();
    note.content = getContent();
    note.dateAndTime = new Date().toLocaleString();
    note.categories = getCategory(); // Use categories array

    localStorage.setItem(editingNoteID, JSON.stringify(note));

    return note; // Ensure the updated note is returned
}

export function loadNotes() { // Load all stored notes into array and post them to the menu
    storedNotesArr = JSON.parse(localStorage.getItem("storedNotesArr")) || [];
    Object.keys(localStorage).forEach(key => {
        if (key !== "storedNotesArr") {
            storedNotesArr.push(JSON.parse(localStorage.getItem(key)));
        }
    });
    storedNotesArr.forEach(note => {
        addNoteToMenu();
    });
}



