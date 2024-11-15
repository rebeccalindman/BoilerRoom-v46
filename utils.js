import { storedNotesArr, editingNoteID, getTitle, getContent } from "./data.js";

export function checkForEdits() { // checks if the content or title has been changed since last save
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

export function generateUniqueID() {
    let uniqueID = Math.random().toString(36).substring(2, 9);
    while (localStorage.getItem(uniqueID)) {
        uniqueID = Math.random().toString(36).substring(2, 9);
    }
    return uniqueID;
}


