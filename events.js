// events.js
import { 
    storedNotesArr,
    saveCurrentNote, 
    createNewNote, 
    deleteNoteByID, 
    addNoteToMenu, 
    checkForEdits, 
    editingNoteID,
    updateFormHeaderText
} from './main.js';

import { getContent } from './utils.js';
import { sortByTitle, sortByContentSize, filterNotesByCategory } from './sorting.js';
import { firstClickConfirmation, showWarningMessage, hideWarningMessage } from './buttonHandlers.js'; 
import { clearAllSavedNotes } from './storage.js';




// Function to initialize all event listeners
export function initializeEventListeners() {
    const newNoteButton = document.getElementById("resetButton");
    const saveButton = document.getElementById("saveButton");
    const deleteButton = document.getElementById("deleteButton");
    const actionWarning = document.getElementById("actionWarning");
    const clearAllButton = document.getElementById("clearAllButton");
    let clearAllStage = 0; // (0 = no confirmation, 1 = first, 2 = second)

    // Save Button Logic
    saveButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent form submission
        //if empty
         if (getContent() == "") {
            showWarningMessage (actionWarning, "There is nothing to save!")
            //hide after 3 seconds
            setTimeout(() => {
                hideWarningMessage(actionWarning);
            }, 3000);
            return;
        } 
        saveCurrentNote();
        hideWarningMessage(actionWarning);
        showWarningMessage(actionWarning, "Note saved!");
        console.log("Note saved!");
        updateFormHeaderText();
        // hide after 3 seconds
        setTimeout(() => {
            hideWarningMessage(actionWarning);  
        }, 3000);
        //reset search
        document.getElementById("searchInput").value = "";
    });

    // New Note Button Logic
    newNoteButton.addEventListener("click", function () {
        if (checkForEdits()) {
            firstClickConfirmation(newNoteButton, actionWarning, "You have unsaved changes!", createNewNote);
        } else {
            createNewNote();
        }
        updateFormHeaderText();

        //reset search
        document.getElementById("searchInput").value = "";
    });

    // Dark mode toggle
    document.getElementById("themeToggle").addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        document.getElementById("content").classList.toggle("dark-mode");
        document.getElementById("title").classList.toggle("dark-mode");
        document.getElementById("themeToggle").classList.toggle("dark-mode");
        // dark mode button
        if (document.body.classList.contains("dark-mode")) {
            document.getElementById("themeToggle").innerText = "Light Mode 🌝";
        } else {
            document.getElementById("themeToggle").innerText = "Dark Mode 🌚";
        }
    });

    // Delete Button Logic
    deleteButton.addEventListener("click", function () {
        if (editingNoteID) {
            firstClickConfirmation(deleteButton, actionWarning,"Are you sure you want to delete this note?", () => {
                deleteNoteByID(editingNoteID);
                createNewNote(); // Reset the form after deletion
            });
        } else {
            console.log("No note selected to delete!");
        }
        updateFormHeaderText();

        //reset search        
        document.getElementById("searchInput").value = "";
    });

    // Search for notes
    document.getElementById("searchInput").addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();
        const filteredNotes = storedNotesArr.filter(note => 
            note.title.toLowerCase().includes(searchTerm) || 
            note.content.toLowerCase().includes(searchTerm)
        );
        addNoteToMenu(filteredNotes);
        // reset tag menu
        document.getElementById("categoriesSelect").value = "all";
    });

    // Sort by title
    let isSortedByTitle = false;
    document.getElementById("sortTitleButton").addEventListener("click", function () {
        if (isSortedByTitle) {
            storedNotesArr.reverse();
            isSortedByTitle = false;
        } else {
            sortByTitle();
            isSortedByTitle = true;
        }
        addNoteToMenu();
        // Reset filter dropdown
        document.getElementById("categoriesSelect").value = "all";
        //reset searchbar
        document.getElementById("searchInput").value = "";
    });

    // Sort by content size
    let isSortedByContentSize = false;
    document.getElementById("sortContentButton").addEventListener("click", function () {
        if (isSortedByContentSize) {
            storedNotesArr.reverse();
            isSortedByContentSize = false;
        } else {
            sortByContentSize();
            isSortedByContentSize = true;
        }
        addNoteToMenu();
        // Reset filter dropdown
        document.getElementById("categoriesSelect").value = "all";
        //reset searchbar
        document.getElementById("searchInput").value = "";
    });

    // Filter by category
    document.getElementById("categoriesSelect").addEventListener("change", function () {
        const selectedCategory = this.value;

        // Display all notes if "All" is selected, otherwise filter by category
        const filteredNotes = selectedCategory.toLowerCase() === "all" 
            ? storedNotesArr 
            : filterNotesByCategory(selectedCategory);

        addNoteToMenu(filteredNotes);
        //reset searchbar
        document.getElementById("searchInput").value = "";
    });

    // Clear All Notes Button Logic
    clearAllButton.addEventListener("click", function () {
        const CLEAR_ALL_WARNING = document.getElementById("clearAllWarning");
        if (clearAllStage === 0) {
            // First click: Show the first warning
            showWarningMessage(CLEAR_ALL_WARNING, "Are you sure you want to delete ALL notes?");
            clearAllButton.innerText = "Yes, I'm sure!";
            clearAllStage = 1; // Move to the second stage
        } else if (clearAllStage === 1) {
            // Second click: Show the final warning
            showWarningMessage(CLEAR_ALL_WARNING, "This action cannot be undone. Proceed?");
            clearAllButton.innerText = "Final Confirmation!";
            clearAllStage = 2; // Move to the final stage
        } else if (clearAllStage === 2) {
            // Final click: Execute the action
            clearAllSavedNotes();
            clearAllButton.innerText = "Empty the nest"; // Reset the button text
            clearAllStage = 0; // Reset the stage
            hideWarningMessage(CLEAR_ALL_WARNING);
        }
    });

}
