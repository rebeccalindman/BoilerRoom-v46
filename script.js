let storedNotesArr = [];

function getTitle() {
    return document.getElementById("title").value;
}

function getContent() {
    return document.getElementById("content").value;
}
function generateUniqueID() {
    let uniqueID = Math.random().toString(36).substring(2, 9);
    while (checkUniqueID(uniqueID)) {
        uniqueID = Math.random().toString(36).substring(2, 9);
    }
    return uniqueID;
}

//compare to stored IDs
function checkUniqueID(uniqueID) {
    return localStorage.getItem(uniqueID);
}

function addNote() {
    const title = getTitle();
    const content = getContent();
    const uniqueID = generateUniqueID();
    const dateAndTime = new Date().toLocaleString();
    const note = { title, content, uniqueID, dateAndTime };
    localStorage.setItem(uniqueID, JSON.stringify(note));
    return note;
}


    /**
     * Calls addNote and adds the returned note object to the storedNotesArr array
     * @returns {Object} note object
     */
function storeNote() {
    const newNote = addNote(); // calls addNote
    storedNotesArr.push(newNote); //stores the returned object in an array
    console.log("pushed new note to array");
    
    
    return newNote;
    

}

function getNote(params) {
    
}

function addNoteToMenu () {
    const list = document.getElementById("listOfStoredNotes");
    const menuListItem = document.createElement("li");

    storedNotesArr.forEach(note => {
        const title = document.createElement("h4");
        title.innerText = note.title;


        const preview = document.createElement("p");
        preview.innerText = note.content;

        title.substring(0, 20);
        preview.substring(0, 40);

        // append to menu list
        menuListItem.appendChild(title);
        menuListItem.appendChild(preview);
        list.appendChild(menuListItem);
        
    });



    


    
}

function displayNote() {

}

//event listener for submit
const submitForm = document.getElementById("form");
submitForm.addEventListener("submit", function (event){
    event.preventDefault();
    const storedNote = storeNote();
    
    // update time
    const date = document.getElementById("date");
    date.innerText = storedNote.dateAndTime;


    //update id
    const noteID = document.getElementById("noteID");
    noteID.innerText = storedNote.uniqueID;

    console.log("storedNote: ", storedNote);
    console.log("storedNotesArr: ", storedNotesArr);
    
    
});
