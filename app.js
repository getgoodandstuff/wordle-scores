const textareaEl = document.getElementById('score-input');
const resultEl = document.getElementById('result');

//prevents entering text
textareaEl.addEventListener('keydown', (e) => {
    e.preventDefault();
});
//prevents cutting content
textareaEl.addEventListener('cut', (e) => {
    e.preventDefault();
});
//PASTING TEXT
textareaEl.addEventListener('paste', (e) => {
    e.preventDefault();
    //gets what the user has copied
    const pastedContent = e.clipboardData.getData("text").split(" ");
    console.log(pastedContent);
    //checks if it's a wordle score
    if (pastedContent[0] == "Wordle" && pastedContent.length == 3) {
        //confirms the paste
        submit();
    }
    else {
        //the paste was not a wordle score
        resultEl.innerText = "Copy your wordle score you silly goose! Then try pasting again.";

    }
});

document.getElementById('submit-score').addEventListener('click', submit);

async function submit() {
    //**ADD*CONFIRM THAT THE SUBMISSION IS FOR THE CURRENT DAY***/
    //can only submit the score if text is empty
    if (textareaEl.value == "") {
        try {
            //gets the users clipboard
            const pastedContent = await navigator.clipboard.readText();
            console.log(pastedContent);
            let splittedContent = pastedContent.split(" ");
            //checks if it's a wordle score
            if (splittedContent[0] == "Wordle" && splittedContent.length == 3) {
                // Here, you can store or display the score in your app
                textareaEl.value = pastedContent;
                resultEl.textContent = `Your Wordle score: \n${pastedContent}`;

                // Optionally, you could save it to a server or local storage
                // Example: Save to localStorage
                // localStorage.setItem('wordleScore', score);
            } else {
                resultEl.innerText = "Copy your wordle score you silly goose! Then try pasting again.";
            }
        } catch (err) {
            console.error('Clipboard read failed:', err);
            resultEl.innerText = 'Error reading clipboard';
        }
    }
}

//DATE MANAGEMENT
const dateEl = document.getElementById('date-display');
const dateObj = new Date();

//Updates the date to change it while running
setInterval(() => {
    checkIfNewDay();
    console.log(dateObj.getMinutes());
    console.log(dateObj.getSeconds());
    console.log(dateObj.getMilliseconds());
}, 60000);
//Checks if the date is different
checkIfNewDay();
function checkIfNewDay() {
    const now = new Date(); // Get current date and time
    if (now.toDateString() !== localStorage.getItem('lastSeenDate')) {
        localStorage.setItem('lastSeenDate', now.toDateString());
        console.log("Updated Date!");
        console.log(now.getHours());
        console.log(now.getMinutes());
        console.log(now.getSeconds());
        //RESET THE INPUT
        resultEl.innerText = "";
        textareaEl.value = "";
    }
    displayDate();
}

//Updates the screens date
function displayDate() {
    const now = new Date(); // Get current date and time
    //0-11
    //month
    //1-31
    //day;
    //0-6
    //week
    switch (now.getDay()) {
        case 0:
            dateEl.innerText = "Sunday, ";
            break;
        case 1:
            dateEl.innerText = "Monday, ";
            break;
        case 2:
            dateEl.innerText = "Tuesday, ";
            break;
        case 3:
            dateEl.innerText = "Wednesday, ";
            break;
        case 4:
            dateEl.innerText = "Thursday, ";
            break;
        case 5:
            dateEl.innerText = "Friday, ";
            break;
        case 6:
            dateEl.innerText = "Saturday, ";
            break;
        default:
            dateEl.innerText = "No Weekday found, ";
            break;
    }

    switch (now.getMonth()) {
        case 0:
            dateEl.innerText += " January";
            break;
        case 1:
            dateEl.innerText += " February";
            break;
        case 2:
            dateEl.innerText += " March";
            break;
        case 3:
            dateEl.innerText += " April";
            break;
        case 4:
            dateEl.innerText += " May";
            break;
        case 5:
            dateEl.innerText += " June";
            break;
        case 6:
            dateEl.innerText += " July";
            break;
        case 7:
            dateEl.innerText += " August";
            break;
        case 8:
            dateEl.innerText += " September";
            break;
        case 9:
            dateEl.innerText += " October";
            break;
        case 10:
            dateEl.innerText += " November";
            break;
        case 11:
            dateEl.innerText += " December";
            break;
        default:
            dateEl.innerText += " No month found"
    }
    dateEl.innerText += (" " + now.getDate().toString() + " " + now.getFullYear().toString());
}

//calculate time difference
function timeAgo(date) {
    const now = new Date(); // Get current date and time
    const diffTime = now - new Date(date); // Difference in milliseconds

    // Calculate the difference in various units
    const seconds = Math.floor(diffTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // Return a readable format
    if (days > 0) return `${days} days ago`;
}

const someDate = "2023-09-18"; // Date format: YYYY-MM-DD
console.log(timeAgo(someDate)); // Output will depend on the current date