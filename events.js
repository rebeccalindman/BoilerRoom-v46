import { saveCurrentNote, createNewNote, deleteNoteByID, clearAllSavedNotes } from "./data.js";
import { addNoteToMenu, sortByTitle, sortByContentSize, filterNotesByCategory ,hideWarningMessage } from "./ui.js";
import { checkForEdits} from "./utils.js";

// DOM Elements
const newNoteButton = document.getElementById("resetButton");
const saveButton = document.getElementById("saveButton");
const deleteButton = document.getElementById("deleteButton");
const actionWarning = document.getElementById("actionWarning");

export function initializeEventListeners() {

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


    // Sort by title
    document.getElementById("sortTitleButton").addEventListener("click", function () {
        sortByTitle();
        addNoteToMenu();
        //reset filter dropdown
        document.getElementById("categoriesSelect").value = "all";
    });

    // Sorty by content size
    document.getElementById("sortContentButton").addEventListener("click", function () {
        sortByContentSize();
        addNoteToMenu();
        //reset filter dropdown
        document.getElementById("categoriesSelect").value = "all";
    });

    //Filter by category
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


export function firstClickConfirmation(button, warningMessage, onSecondClick) {
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
