// storage.js

import {addNoteToMenu} from './main.js';
import { getTitle, getContent } from './utils.js';

// Local storage of unsaved user input
export const AUTO_SAVE_KEY = "temporaryNote";
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


function clearAllSavedNotes() {
    localStorage.clear();
    storedNotesArr = [];
    addNoteToMenu();
}

export { storeTemporaryNote, getAutoSavedNote, clearAllSavedNotes} 
