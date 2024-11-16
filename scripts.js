// scripts.js
import { initializeEventListeners, AUTO_SAVE_KEY, temporaryNote } from './events.js'; //todo temporarynote not needed?

// Global variables
let storedNotesArr = [];
let editingNoteID = null;

// Local storage of unsaved user input



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




const TEMPORARY_NOTE_ID = "temporaryNoteID";
const TEMPORARY_NOTE_DATE = new Date().toLocaleString();
if (!localStorage.getItem(AUTO_SAVE_KEY)) {
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify({ title: "", content: "", dateAndTime: TEMPORARY_NOTE_DATE, uniqueID: TEMPORARY_NOTE_ID }));
}

// Fetch the existing temporary note




// Functions
let activeConfirmationButton = null;

function firstClickConfirmation(button, warningMessage, onSecondClick) {
    // Check if this button is already in confirmation state
    if (activeConfirmationButton === button) {
        // Execute the callback on the second click
        onSecondClick();
        resetButtonState(button);
        hideWarningMessage();
        activeConfirmationButton = null; // Clear the active button
    } else {
        // Save the original text if not already saved
        if (!button.dataset.originalText) {
            saveOriginalButtonText(button);
        }

        // Display warning
        showWarningMessage(warningMessage);
        button.innerText = "Sure?";
        button.classList.add("warning");
        activeConfirmationButton = button; // Set the active confirmation button

        // Add a document-wide click listener to detect clicks outside the button
        const outsideClickListener = (event) => {
            if (!button.contains(event.target)) {
                // Reset the button if the click is outside
                resetButtonState(button);
                hideWarningMessage();
                activeConfirmationButton = null; // Clear the active button

                // Remove the document click listener
                document.removeEventListener("click", outsideClickListener);
            }
        };

        document.addEventListener("click", outsideClickListener);
    }
}



function filterNotesByCategory(category) {
    return storedNotesArr.filter(note => (note.categories || []).includes(category));
}

function sortByDate() {
    storedNotesArr.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });
    console.log("Sorted notes:", storedNotesArr);
    
}

function sortByTitle() {
    storedNotesArr.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return titleA.localeCompare(titleB);
    });
    console.log("Sorted notes:", storedNotesArr);
}

function sortByContentSize() {
    storedNotesArr.sort((a, b) => {
        const contentA = a.content.length;
        const contentB = b.content.length;
        return contentB - contentA;
    });
    console.log("Sorted notes:", storedNotesArr);
}

function storeTemporaryNote () {
    const TITLE = getTitle();
    const CONTENT = getContent();
    const UNIQUE_ID = "temporaryNoteID";
    const DATE = new Date().toLocaleString();

    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify({ title: TITLE, content: CONTENT, uniqueID: UNIQUE_ID, dateAndTime: DATE }));

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
    if (button.dataset.originalText) {
        button.innerText = button.dataset.originalText;
    } else {
        console.warn("Original text not found for button:", button); // error log
    }
    button.classList.remove("warning");
}


function saveOriginalButtonText(button) {
    button.dataset.originalText = button.innerText;
}

function showWarningMessage(message) {
    actionWarning.innerText = message;
    actionWarning.classList.remove("hidden");
}

function hideWarningMessage() {
    actionWarning.classList.add("hidden");
}

function loadNotes() { // Load all stored notes into array and post them to the menu
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

function getCategory() {
    const checkboxes = document.querySelectorAll('input[name="category"]:checked');
    const selectedCategories = Array.from(checkboxes).map(checkbox => checkbox.value);
    return selectedCategories;
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
    note.categories = getCategory(); // Use categories array

    localStorage.setItem(editingNoteID, JSON.stringify(note));

    return note; // Ensure the updated note is returned
}



function addNoteToMenu(notesList = storedNotesArr) { //storedNotesArr is default value if notesList is not provided
    const list = document.getElementById("listOfStoredNotes");
    list.innerHTML = ""; // Clears the content of the list element

    if (notesList.length === 0) {
        const li = document.createElement("li");
        li.classList.add("placeholder");
        li.innerText = "No notes found for the selected category.";
        list.appendChild(li);
        return;
    }

    notesList.forEach(note => {
        const li = document.createElement("li");
        const categoriesText = note.categories ? note.categories.join(", ") : "No Tags";
        li.innerHTML = `
            <p style="font-size: 0.8rem; color: #555;"># ${categoriesText}</p>
            <h4>${note.title || "Untitled Note"}</h4>
            <p>${note.content.substring(0, 40) || "No content..."}</p>
            <p style="font-size: 0.8rem; font-style: italic;">${note.dateAndTime}</p>
        `;
        li.addEventListener("click", () => fetchNoteByID(note.uniqueID));
        list.appendChild(li);
    });
}

function clearAllSavedNotes() {
    localStorage.clear();
    storedNotesArr = [];
    addNoteToMenu();
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

    // !Check only the categories associated with the note
    if (note.categories) {
        note.categories.forEach(category => {
            const checkbox = document.querySelector(`input[name="category"][value="${category}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    
    editingNoteID = uniqueID;
}

export {
    storedNotesArr,
    editingNoteID,
    saveCurrentNote,
    createNewNote,
    addNoteToMenu,
    clearAllSavedNotes,
    checkForEdits,
    fetchNoteByID,
    storeTemporaryNote,
    sortByTitle,
    sortByContentSize,
    filterNotesByCategory,
    deleteNoteByID,
    loadNotes,
    getAutoSavedNote,
    firstClickConfirmation,
    resetButtonState,
    showWarningMessage,
    hideWarningMessage,
    updateNoteData,
    addNote,
    generateUniqueID,
    getCategory,
    getTitle,
    getContent
};

