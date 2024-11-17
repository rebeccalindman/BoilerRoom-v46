// main.js
import { initializeEventListeners } from './scripts/events.js'; 

import { getTitle, getContent, getCategory, generateUniqueID } from './scripts/utils.js';

import { saveOriginalButtonText } from './scripts/buttonHandlers.js'; 

import { storeTemporaryNote, getAutoSavedNote, AUTO_SAVE_KEY, loadNotes, storedNotesArr} from './scripts/storage.js';

// Global variables
let editingNoteID = null;


document.addEventListener("DOMContentLoaded", function () {
    // Load existing notes
    loadNotes();
    getAutoSavedNote();

    // Set up auto-save interval
    setInterval(() => {
        storeTemporaryNote();
    }, 10000); // 10 seconds

    document.querySelectorAll("button").forEach((button) => {
        saveOriginalButtonText(button); //saves the button texts on load
    });

    // Initialize all event listeners
    initializeEventListeners();
});


function updateFormHeaderText(){
    const newTitle = getTitle();
    document.getElementById("formHeader").innerText = newTitle;
    if (newTitle === "") {
        document.getElementById("formHeader").innerText = "New Note";
    }
}



function checkForEdits() {
    const inputTitle = getTitle();
    const inputContent = getContent();

    if (editingNoteID) { // If a note is being edited
        
        // Get the note object from the array
        const noteBeingEdited = storedNotesArr.find(item => item.uniqueID === editingNoteID);

        if (!noteBeingEdited) { // If the note cannot be found
            console.warn("No note found for editing.");
            return false;
        }
        // Compare stored values with input values
        return noteBeingEdited.title !== inputTitle || noteBeingEdited.content !== inputContent;
    }

     // If no note is being edited but there is input, treat it as unsaved changes
     return inputTitle.trim() !== "" || inputContent.trim() !== "";
}

function saveCurrentNote() {
    let storedNote;

    if (editingNoteID) {
        // Edit the existing note
        storedNote = updateNoteData();
        if (!storedNote) {
            console.error("Failed to update the note. No note found for editing.");
            console.log("Stored notes:", storedNotesArr);
            addNote();
            createNewNote();
            editingNoteID = true; // to keep it from creating a new note
            addNoteToMenu();
            
            console.log("new note created");
            
            return;
        }
    } else {
        // Create a new note
        storedNote = addNote();
        editingNoteID = storedNote.uniqueID; // Assign a new unique ID to the editing note
    }

    // Update the date and ID display
    if (storedNote) {
        document.getElementById("date").innerText = storedNote.dateAndTime || "";
        document.getElementById("noteID").innerText = storedNote.uniqueID || "";
    }

    // Clear the temporary note
    localStorage.removeItem(AUTO_SAVE_KEY);

    // Refresh the notes list
    addNoteToMenu();

    console.log("Stored note:", storedNote);
}

function createNewNote() {
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

function addNote() {
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



function fetchNoteByID(uniqueID) {
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

    // Check only the categories associated with the note when fetching
    if (note.categories) {
        note.categories.forEach(category => {
            const checkbox = document.querySelector(`input[name="category"][value="${category}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    
    editingNoteID = uniqueID;
    updateFormHeaderText(); //updates form header text to the note title
    console.log("Note fetched:", note);
    
}
function updateNoteData() {
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


function addNoteToMenu(notesList = storedNotesArr) { //storedNotesArr is default value if notesList is not provided
    const list = document.getElementById("listOfStoredNotes");
    list.innerHTML = ""; // Clears the content of the list element

    // Filter out the temporary note
    const filteredNotes = notesList.filter(note => note.uniqueID !== "temporaryNoteID");

    if (filteredNotes.length === 0 && storedNotesArr.length > 0 ) {
        const li = document.createElement("li");
        li.classList.add("placeholder");
        li.innerText = "No notes found that match the selected category.";
        list.appendChild(li);
        return;
    } else if (notesList.length === 0) {
        const li = document.createElement("li");
        li.classList.add("placeholder");
        li.innerText = "Create and save your first note to add it to the nest";
        list.appendChild(li);
        return;
    }

    filteredNotes.forEach(note => {
        const li = document.createElement("li");
        const categoriesText = note.categories ? note.categories.join(", ") : "No Tags";
        li.innerHTML = `
            <p id="categoryText" style="font-size: 0.8rem; color: #555;"># ${categoriesText}</p>
            <h4>${note.title || "Untitled Note"}</h4>
            <p>${note.content.substring(0, 40) || "No content..."}</p>
            <p style="font-size: 0.8rem; font-style: italic;">${note.dateAndTime}</p>
        `;
        li.addEventListener("click", () => fetchNoteByID(note.uniqueID));

        // Always prepend to the top
        list.insertBefore(li, list.firstChild);
        
    });
}


export {
    editingNoteID,
    saveCurrentNote,
    createNewNote,
    addNoteToMenu,
    checkForEdits,
    fetchNoteByID,
    updateNoteData,
    addNote,
    updateFormHeaderText
};

