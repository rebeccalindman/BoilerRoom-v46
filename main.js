import { initializeEventListeners } from "./events.js";    
import { loadNotes, getAutoSavedNote, storeTemporaryNote } from "./data.js";


// Local storage of unsaved user input
const AUTO_SAVE_KEY = "temporaryNote";

if (!localStorage.getItem(AUTO_SAVE_KEY)) {
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify({ title: "", content: "" }));
}

// Fetch the existing temporary note
let temporaryNote = JSON.parse(localStorage.getItem(AUTO_SAVE_KEY));




// Run when DOM loads
document.addEventListener("DOMContentLoaded", function () {
    // Load existing notes
    loadNotes();
    getAutoSavedNote();

    // interval for auto store note
    setInterval(() => {
        storeTemporaryNote();
    }, 10000); // 10 seconds

    initializeEventListeners();

    console.log(temporaryNote);

});
