// sorting.js

import {storedNotesArr} from './main.js';

function filterNotesByCategory(category) {
    return storedNotesArr.filter(note => (note.categories || []).includes(category));
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

export {filterNotesByCategory, sortByTitle, sortByContentSize}