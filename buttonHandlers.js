// buttonHandlers.js

// Fetch the existing temporary note

// Functions
let activeConfirmationButton = null;

function resetButtonState(button) {
    if (button.dataset.originalText) {
        button.innerText = button.dataset.originalText;
    } else {
        console.warn("Original text not found for button:", button); // error log
    }
    button.classList.remove("warning");
}

function saveOriginalButtonText(button) {
    button.dataset.originalText = button.innerText;
}

function showWarningMessage(element, message) {
    element.innerText = message;
    element.classList.remove("hidden");
}

function hideWarningMessage(element) {
    element.classList.add("hidden");
}

function firstClickConfirmation(button, displayElement, warningMessage, onSecondClick) {
    // Check if this button is already in confirmation state
    if (activeConfirmationButton === button) {
        // Execute the callback on the second click
        onSecondClick();
        resetButtonState(button);
        hideWarningMessage(displayElement);
        activeConfirmationButton = null; // Clear the active button
    } else {
        // Save the original text if not already saved
        if (!button.dataset.originalText) {
            saveOriginalButtonText(button);
        }

        // Display warning
        showWarningMessage(displayElement, warningMessage);
        button.innerText = "Sure?";
        button.classList.add("warning");
        activeConfirmationButton = button; // Set the active confirmation button

        // Add a document-wide click listener to detect clicks outside the button
        const outsideClickListener = (event) => {
            if (!button.contains(event.target)) {
                // Reset the button if the click is outside
                resetButtonState(button);
                hideWarningMessage(displayElement);
                activeConfirmationButton = null; // Clear the active button

                // Remove the document click listener
                document.removeEventListener("click", outsideClickListener);
            }
        };

        document.addEventListener("click", outsideClickListener);
    }
}

export { firstClickConfirmation, showWarningMessage, hideWarningMessage, resetButtonState, saveOriginalButtonText}