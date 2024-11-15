// Global variables
let storedNotesArr = [];
let editingNoteID = null;

//run loadnotes when DOM loads
document.addEventListener("DOMContentLoaded", loadNotes);


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



function getTitle() { //fetches title input from form
    return document.getElementById("title").value;
}

function getContent() { //fetches content input from form
    return document.getElementById("content").value;
}

function generateUniqueID() {
    let uniqueID = Math.random().toString(36).substring(2, 9);
    while (checkUniqueID(uniqueID)) {
        uniqueID = Math.random().toString(36).substring(2, 9);
    }
    return uniqueID;
}

function checkUniqueID(uniqueID) {
    return localStorage.getItem(uniqueID);
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

function fetchNoteByID(uniqueID) {
    let note = storedNotesArr.find(item => item.uniqueID === uniqueID);

    if (note) {
        document.getElementById("title").value = note.title;
        document.getElementById("content").value = note.content;
        document.getElementById("noteID").innerText = note.uniqueID;
        document.getElementById("date").innerText = note.dateAndTime;

        editingNoteID = uniqueID;
        return (note); //todo test if works
    } else {
        console.log("Note not found!");
    }
}

function editNote() {
    const title = getTitle();
    const content = getContent();
    const dateAndTime = new Date().toLocaleString();

    const note = storedNotesArr.find(item => item.uniqueID === editingNoteID);
    if (note) {
        note.title = title;
        note.content = content;
        note.dateAndTime = dateAndTime;

        localStorage.setItem(editingNoteID, JSON.stringify(note));
    } else {
        console.log("Note not found for editing!");
    }

    return note;
}

function addNoteToMenu() {
    const list = document.getElementById("listOfStoredNotes");
    list.innerHTML = '';

    storedNotesArr.forEach(note => {
        const menuListItem = document.createElement("li");

        const title = document.createElement("h4");
        title.innerText = note.title.substring(0, 20);
        if (note.title == "") {
            title.innerText = "New Note" + " " + note.dateAndTime;
        }

        const date = document.createElement("p");
        date.style.fontSize = "0.8rem";
        date.style.fontStyle = "italic";
        date.innerText = note.dateAndTime;

        const preview = document.createElement("p");
        preview.innerText = note.content.substring(0, 40);
        if (note.content.length > 40) {
            preview.innerText = note.content.substring(0, 40) + "...";
        }

        menuListItem.appendChild(title);
        menuListItem.appendChild(date);
        menuListItem.appendChild(preview);

        menuListItem.addEventListener("click", () => {
            fetchNoteByID(note.uniqueID);
        });

        list.appendChild(menuListItem);
    });
}

//todo display note function ??? maybe
/* function displayNote() {
    // Function to display a full note
} */

function saveCurrentNote(event) {
    event.preventDefault();

    let storedNote;

    if (editingNoteID) {
        // Edit the existing note
        storedNote = editNote();
    } else {
        // Create a new note
        storedNote = addNote();
        editingNoteID = storedNote.uniqueID;
    }

    // Update the date and ID display
    document.getElementById("date").innerText = storedNote.dateAndTime;
    document.getElementById("noteID").innerText = storedNote.uniqueID;

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

function clickTwiceToConfirm (){ //todo
    
}

// Event listeners

const saveNote = document.getElementById("form");
saveNote.addEventListener("submit", saveCurrentNote); // Save changes to the current note

const newNote = document.getElementById("form");
newNote.addEventListener("reset", function (event) { // Create a new note
    event.preventDefault();

    if (checkForEdits()) {
        console.log("there are edits");
        //todo display error message under button
        /* clickTwiceToConfirm(); */ // todo
    } else {
        createNewNote();
    }

});


