
import { storedNotesArr } from "./data.js";
import { fetchNoteByID } from "./data.js";

export function addNoteToMenu(notesList = storedNotesArr) { //storedNotesArr is default value if notesList is not provided
    const list = document.getElementById("listOfStoredNotes");
    list.innerHTML = "";

    if (notesList.length === 0) {
        const li = document.createElement("li");
        li.classList.add("placeholder");
        li.innerText = "No notes found for the selected category.";
        list.appendChild(li);
        return;
    }

    notesList.forEach(note => {
        const li = document.createElement("li");
        const categoriesText = note.categories ? note.categories.join(", ") : "No Tags";
        li.innerHTML = `
            <p style="font-size: 0.8rem; color: #555;"># ${categoriesText}</p>
            <h4>${note.title || "Untitled Note"}</h4>
            <p>${note.content.substring(0, 40) || "No content..."}</p>
            <p style="font-size: 0.8rem; font-style: italic;">${note.dateAndTime}</p>
        `;
        li.addEventListener("click", () => fetchNoteByID(note.uniqueID));
        list.appendChild(li);
    });
}


export function resetButtonState(button) {
    button.innerText = button.id === "resetButton" ? "New Note" : "Delete";
    button.classList.remove("warning");
}


export function showWarningMessage(message) {
    actionWarning.innerText = message;
    actionWarning.classList.remove("hidden");
}


export function getTitle() {
    return document.getElementById("title").value;
}


export function getContent() {
    return document.getElementById("content").value;
}


export function getCategory() {
    const checkboxes = document.querySelectorAll('input[name="category"]:checked');
    const selectedCategories = Array.from(checkboxes).map(checkbox => checkbox.value);
    return selectedCategories;
}


export function hideWarningMessage() {
    actionWarning.classList.add("hidden");
}




export function sortByTitle() {
    storedNotesArr.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return titleA.localeCompare(titleB);
    });
    console.log("Sorted notes:", storedNotesArr);
}

export function sortByContentSize() {
    storedNotesArr.sort((a, b) => {
        const contentA = a.content.length;
        const contentB = b.content.length;
        return contentB - contentA;
    });
    console.log("Sorted notes:", storedNotesArr);
}


export function filterNotesByCategory(category) {
    return storedNotesArr.filter(note => (note.categories || []).includes(category));
}

