// utils.js 


function getTitle() {
    return document.getElementById("title").value;
}

function getContent() {
    return document.getElementById("content").value;
}

function getCategory() {
    const checkboxes = document.querySelectorAll('input[name="category"]:checked');
    const selectedCategories = Array.from(checkboxes).map(checkbox => checkbox.value);
    return selectedCategories;
}

function generateUniqueID() {
    let uniqueID = Math.random().toString(36).substring(2, 9);
    while (localStorage.getItem(uniqueID)) {
        uniqueID = Math.random().toString(36).substring(2, 9);
    }
    return uniqueID;
}

export { getTitle, getContent, getCategory, generateUniqueID };