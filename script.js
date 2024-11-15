// Global variables
let storedNotesArr = [];
let editingNoteID = null;

// DOM Elements
const newNoteButton = document.getElementById("resetButton");
const saveButton = document.getElementById("saveButton");
const deleteButton = document.getElementById("deleteButton");
const unsavedWarning = document.getElementById("unsavedWarning");

// Run when DOM loads
document.addEventListener("DOMContentLoaded", function () {
    loadNotes();

    // Save Button Logic
    saveButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent form submission
        saveCurrentNote();
        hideWarning(unsavedWarning);
        console.log("Note saved!");
    });

    // New Note Button Logic
    newNoteButton.addEventListener("click", function () {
        firstClickConfirmation(newNoteButton, "You have unsaved changes!", createNewNote);
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
        button.innerText = "Click again to confirm";
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

function resetButtonState(button) {
    button.innerText = button.id === "resetButton" ? "New Note" : "Delete";
    button.classList.remove("warning");
}

function showWarningMessage(message) {
    unsavedWarning.innerText = message;
    unsavedWarning.classList.remove("hidden");
}

function hideWarningMessage() {
    unsavedWarning.classList.add("hidden");
}

function loadNotes() {
    storedNotesArr = JSON.parse(localStorage.getItem("storedNotesArr")) || [];
    storedNotesArr.forEach(note => addNoteToMenu(note));
}

function saveCurrentNote() {
    if (editingNoteID) {
        updateNoteData();
    } else {
        const note = addNote();
        editingNoteID = note.uniqueID;
    }
    addNoteToMenu();
    console.log("Note saved or updated.");
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
    if (!note) return console.error("No note to update!");

    note.title = getTitle();
    note.content = getContent();
    note.dateAndTime = new Date().toLocaleString();

    localStorage.setItem(editingNoteID, JSON.stringify(note));
}

function addNoteToMenu() {
    const list = document.getElementById("listOfStoredNotes");
    list.innerHTML = "";
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
