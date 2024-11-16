// events.js
import { 
    saveCurrentNote, 
    createNewNote, 
    deleteNoteByID, 
    addNoteToMenu, 
    clearAllSavedNotes, 
    checkForEdits, 
    firstClickConfirmation, 
    resetButtonState, 
    showWarningMessage, 
    hideWarningMessage, 
    updateNoteData, 
    addNote, 
    generateUniqueID, 
    getCategory, 
    getTitle, 
    getContent, 
    sortByTitle, 
    sortByContentSize, 
    filterNotesByCategory,
    editingNoteID,
    storedNotesArr
} from './scripts.js';

export const AUTO_SAVE_KEY = "temporaryNote";
export let temporaryNote = JSON.parse(localStorage.getItem(AUTO_SAVE_KEY)); //todo not needed?


// Function to initialize all event listeners
export function initializeEventListeners() {
    const newNoteButton = document.getElementById("resetButton");
    const saveButton = document.getElementById("saveButton");
    const deleteButton = document.getElementById("deleteButton");
    const actionWarning = document.getElementById("actionWarning");

    // Save Button Logic
    saveButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent form submission
        saveCurrentNote();
        hideWarningMessage(actionWarning);
        console.log("Note saved!");
    });

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

    // Sort by title
    document.getElementById("sortTitleButton").addEventListener("click", function () {
        sortByTitle();
        addNoteToMenu();
        // Reset filter dropdown
        document.getElementById("categoriesSelect").value = "all";
    });

    // Sort by content size
    document.getElementById("sortContentButton").addEventListener("click", function () {
        sortByContentSize();
        addNoteToMenu();
        // Reset filter dropdown
        document.getElementById("categoriesSelect").value = "all";
    });

    // Filter by category
    document.getElementById("categoriesSelect").addEventListener("change", function () {
        const selectedCategory = this.value;

        // Display all notes if "All" is selected, otherwise filter by category
        const filteredNotes = selectedCategory.toLowerCase() === "all" 
            ? storedNotesArr 
            : filterNotesByCategory(selectedCategory);

        addNoteToMenu(filteredNotes);
    });

    // Clear all notes
    document.getElementById("clearAllButton").addEventListener("click", function () {
        firstClickConfirmation(this, "Are you sure you want to clear all notes?", clearAllSavedNotes);
    });
}
