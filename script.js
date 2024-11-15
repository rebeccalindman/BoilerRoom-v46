// Global variables
let storedNotesArr = [];
let editingNoteID = null;

// Local storage of unsaved user input
const AUTO_SAVE_KEY = "temporaryNote";

if (!localStorage.getItem(AUTO_SAVE_KEY)) {
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify({ title: "", content: "" }));
}

// Fetch the existing temporary note
let temporaryNote = JSON.parse(localStorage.getItem(AUTO_SAVE_KEY));


// DOM Elements
const newNoteButton = document.getElementById("resetButton");
const saveButton = document.getElementById("saveButton");
const deleteButton = document.getElementById("deleteButton");
const actionWarning = document.getElementById("actionWarning");

// Run when DOM loads
document.addEventListener("DOMContentLoaded", function () {
    loadNotes();
    getAutoSavedNote();

    // interval for auto store note
    setInterval(() => {
        storeTemporaryNote();
    }, 10000); // 10 seconds

    console.log(temporaryNote);

    // Save Button Logic
    saveButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent form submission
        saveCurrentNote();
        hideWarningMessage(actionWarning);
        console.log("Note saved!");
    });

    // New Note Button Logic
        // New Note Button Logic
        newNoteButton.addEventListener("click", function () {
            if (checkForEdits()) {
                firstClickConfirmation(newNoteButton, "You have unsaved changes!", createNewNote);
            } else {
                createNewNote();
            }
        });

    // Delete Button Logic
    deleteButton.addEventListener("click", function () {
        if (editingNoteID) {
            firstClickConfirmation(deleteButton, "Are you sure you want to delete this note?", () => {
                deleteNoteByID(editingNoteID);
                createNewNote(); // Reset the form after deletion
            });
        } else {
            console.log("No note selected to delete!");
        }
    });
});

// Functions
function firstClickConfirmation(button, warningMessage, onSecondClick) {
    let readyForSecondClick = false;

    // Display warning
    showWarningMessage(warningMessage);

    // First click
    if (!readyForSecondClick) {
        button.innerText = "Sure?";
        button.classList.add("warning");
        readyForSecondClick = true;

        // Reset after timeout
        setTimeout(() => {
            if (readyForSecondClick) {
                resetButtonState(button);
                hideWarningMessage();
                readyForSecondClick = false;
            }
        }, 3000);
    }

    // Second click
    button.addEventListener(
        "click",
        () => {
            if (readyForSecondClick) {
                onSecondClick();
                resetButtonState(button);
                hideWarningMessage();
                readyForSecondClick = false;
            }
        },
        { once: true }
    );
}

function storeTemporaryNote () {
    const TITLE = getTitle();
    const CONTENT = getContent();

    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify({ title: TITLE, content: CONTENT }));

}

function getAutoSavedNote() {
    const savedNote = JSON.parse(localStorage.getItem(AUTO_SAVE_KEY));
    if (savedNote) {
        // Populate the form fields with the saved values
        document.getElementById("title").value = savedNote.title || "";
        document.getElementById("content").value = savedNote.content || "";
    }
}

function resetButtonState(button) {
    button.innerText = button.id === "resetButton" ? "New Note" : "Delete";
    button.classList.remove("warning");
}

function showWarningMessage(message) {
    actionWarning.innerText = message;
    actionWarning.classList.remove("hidden");
}

function hideWarningMessage() {
    actionWarning.classList.add("hidden");
}

function loadNotes() {
    storedNotesArr = JSON.parse(localStorage.getItem("storedNotesArr")) || [];
    storedNotesArr.forEach(note => addNoteToMenu(note));
}

function checkForEdits() { // checks if the content or title has been changed since last save
    if (editingNoteID) {
        //get note object from array
        const noteBeingEdited = storedNotesArr.find(item => item.uniqueID === editingNoteID);
        const storedTitle = noteBeingEdited.title;
        const storedContent = noteBeingEdited.content;

        const inputTitle = getTitle();
        const inputContent = getContent();

        //check if storedtitle or storedcontent is different from current input
        if (storedTitle != inputTitle || storedContent != inputContent) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function saveCurrentNote() {
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

function createNewNote() {
    editingNoteID = null;
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
    document.getElementById("date").innerText = "";
    document.getElementById("noteID").innerText = "";
    console.log("Created a new note.");
}

function addNote() {
    const title = getTitle();
    const content = getContent();
    const uniqueID = generateUniqueID();
    const dateAndTime = new Date().toLocaleString();
    const note = { title, content, uniqueID, dateAndTime };

    storedNotesArr.push(note);
    localStorage.setItem(uniqueID, JSON.stringify(note));
    
    return note;
}

function deleteNoteByID(uniqueID) {
    localStorage.removeItem(uniqueID);
    storedNotesArr = storedNotesArr.filter(note => note.uniqueID !== uniqueID);
    addNoteToMenu();
    console.log("Deleted note:", uniqueID);
}

// Utility Functions
function getTitle() {
    return document.getElementById("title").value;
}

function getContent() {
    return document.getElementById("content").value;
}

function generateUniqueID() {
    let uniqueID = Math.random().toString(36).substring(2, 9);
    while (localStorage.getItem(uniqueID)) {
        uniqueID = Math.random().toString(36).substring(2, 9);
    }
    return uniqueID;
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

    localStorage.setItem(editingNoteID, JSON.stringify(note));

    return note; // Ensure the updated note is returned
}

function addNoteToMenu() {
    const list = document.getElementById("listOfStoredNotes");
    list.innerHTML = "";
    if (storedNotesArr.length === 0) {
        const li = document.createElement("li");
        li.classList.add("placeholder");
        li.innerText = "Create and save your first note to add it to the nest";
        list.appendChild(li);
        return;
    }

    storedNotesArr.forEach(note => {
        const li = document.createElement("li");
        li.innerHTML = `
            <h4>${note.title || "Untitled Note"}</h4>
            <p>${note.content.substring(0, 40) || "No content..."}</p>
            <p style="font-size: 0.8rem; font-style: italic;">${note.dateAndTime}</p>
        `;
        li.addEventListener("click", () => fetchNoteByID(note.uniqueID));
        list.appendChild(li);
    });
}

function fetchNoteByID(uniqueID) {
    const note = storedNotesArr.find(note => note.uniqueID === uniqueID);
    if (!note) return console.error("Note not found!");

    document.getElementById("title").value = note.title;
    document.getElementById("content").value = note.content;
    document.getElementById("date").innerText = note.dateAndTime;
    document.getElementById("noteID").innerText = note.uniqueID;
    editingNoteID = uniqueID;
}
