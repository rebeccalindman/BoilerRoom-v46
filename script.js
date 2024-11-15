// Global variables
let storedNotesArr = [];
let editingNoteID = null;
const newNoteButton = document.getElementById("newNoteButton");
const saveButton = document.getElementById("saveButton");

// run when DOM loads
document.addEventListener("DOMContentLoaded", function () {
    loadNotes();

    // Access the form
    const form = document.getElementById("form");

    // Handle form submission (Save Button)
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission
        saveCurrentNote(); // Save the current note
        document.getElementById("unsavedWarning").classList.add("hidden"); // Hide warning message
        console.log("Note saved!");
    });

    // Handle form reset (New Note Button)
    form.addEventListener("reset", function (event) {
        event.preventDefault(); // Prevent default reset behavior

        // Check for unsaved changes before creating a new note
        if (checkForEdits()) {
            firstclick(document.getElementById("resetButton")); // Handle unsaved changes
        } else {
            createNewNote(); // Clear form and start a new note
            document.getElementById("unsavedWarning").classList.add("hidden"); // Hide warning message
            console.log("New note created!");
        }
    });
});


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

function updateNoteData() {
    if (!editingNoteID) {
        console.error("No note is currently being edited!");
        return null;
    }

    const title = getTitle();
    const content = getContent();
    const dateAndTime = new Date().toLocaleString();

    const note = storedNotesArr.find(item => item.uniqueID === editingNoteID);

    if (note) {
        note.title = title;
        note.content = content;
        note.dateAndTime = dateAndTime;

        localStorage.setItem(editingNoteID, JSON.stringify(note));
        return note; // Return the updated note
    } else {
        console.log("Note not found for editing!");
        return null;
    }
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

function saveCurrentNote() {
    let storedNote;

    if (editingNoteID) {
        // Edit the existing note
        storedNote = updateNoteData();
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

function firstclick(button) {
    let readyForSecondClick = true; // Flag to indicate readiness for second click
    const originalButtonText = button.innerText; // Store the original button text

    // Change the button text and style for the first click
    button.innerText = "Click again to confirm";
    button.classList.add("warning"); // Add a warning class for visual indication
    document.getElementById("unsavedWarning").classList.remove("hidden"); // Show the warning message

    // Event listener for the second click
    const handleSecondClick = () => {
        if (readyForSecondClick) {
            createNewNote(); // Create a new note on confirmation

            // Reset button and warning state immediately after second click
            button.innerText = originalButtonText; // Reset button text
            button.classList.remove("warning"); // Remove warning class
            document.getElementById("unsavedWarning").classList.add("hidden"); // Hide warning message
            console.log("New note created after confirmation.");
        }
    };

    // Attach the second click listener
    button.addEventListener("click", handleSecondClick, { once: true });

    // Reset button state after 3 seconds if no second click
    setTimeout(() => {
        if (readyForSecondClick) {
            readyForSecondClick = false; // Disable second click readiness
            button.innerText = originalButtonText; // Reset button text
            button.classList.remove("warning"); // Remove warning class
            document.getElementById("unsavedWarning").classList.add("hidden"); // Hide warning message
        }
    }, 3000);
}



function secondclick (){ //todo
    createNewNote();

    document.getElementById("unsavedWarning").className = "hidden";
    document.getElementById("newNoteButton").className = "";
    console.log("New note created after confirmation.");
}

/* // Event listeners


saveButton.addEventListener("click", function (event) {
    event.preventDefault(); // Save changes to the current note
    saveCurrentNote();
    document.getElementById("unsavedWarning").classList.add("hidden"); // Hide warning message again
    document.getElementById("newNoteButton").classList.remove("warning"); // remove warning class button color
}); 


newNoteButton.addEventListener("click", function (event) { // Create a new note
    event.preventDefault();

    if (checkForEdits()) {
        firstclick(newNoteButton);
    } else {
        createNewNote();
        document.getElementById("unsavedWarning").classList.add("hidden"); // Hide warning message again
        document.getElementById("newNoteButton").classList.remove("warning"); // remove warning class button color
    }

});


 */