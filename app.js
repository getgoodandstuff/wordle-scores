// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, setDoc, doc, getDoc, deleteDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//ADD** email/password account
//Just need to update lastseen on visibility true
//make them verifyemail to join a group
//Last but not least find out how to display others' scores
//service workeres/?????
//service workers offline persisstance vs firestore offline persisstnace
//Score collection, make public
//I Think error occurs while creating data

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCc6qatLXxL-cnN-rhnz0yQPBn7HXfOmvg",
    authDomain: "wordlescores-76ebb.firebaseapp.com",
    projectId: "wordlescores-76ebb",
    storageBucket: "wordlescores-76ebb.firebasestorage.app",
    messagingSenderId: "170645657035",
    appId: "1:170645657035:web:08b1c755a2878df833124e",
    measurementId: "G-DHYJP8VZR6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Check if service workers are supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/wordle-scores/service-worker.js')  // Path to the service worker file
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

//enables firestore offline persistence
// firebase.firestore().enablePersistence()
//   .catch((err) => {
//     if (err.code === 'failed-precondition') {
//       // Handle cases where the browser doesn't support multiple tabs
//       console.error("Persistence failed: multiple tabs open");
//     } else if (err.code === 'unimplemented') {
//       // Handle unsupported browsers
//       console.error("Persistence is not available in this browser");
//     }
//   });

//call on log in to check if verified
const checkEmailVerification = async () => {
    const user = auth.currentUser;
    if (user) {
        // Refresh the user to get the latest verification status
        await user.reload();

        if (user.emailVerified) {
            // Verified!
            document.getElementById('check-verification-output').innerText = "Verified!";
            console.log("Email verified, user document updated.");
            //Allow joining of groupps!
        } else {
            document.getElementById('check-verification-output').innerText = "Not Verified.";
            console.log("Email not verified yet.");
        }
    }
};

// Function to add a new user
//const email = "user@example.com";
//const password = "userPassword123";
//const username = "johndoe";
// Call the function to create the user, send verification email, and add them to Firestore
//signUpAndVerify(email, password, username);
const signUpAndVerify = async (email, password, displayName) => {
    try {
        //Creating the user with the email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        //send verification email
        await sendEmailVerification(user);
        console.log("Verification email sent");

        //Store user data
        await setDoc(doc(db, "users", user.uid), {
            displayName: displayName,
            lastSeenDate: Timestamp.now(),
        });
        console.log("The email: " + email + " has been used to sign in " + displayName + " with the password of " + password);
        console.log("User document created for UID:", user.uid);
        document.getElementById('sign-up-screeen').style.display = 'none';
        document.getElementById('join-group-screen').style.display = 'flex';
        // document.getElementById('check-verification-button').addEventListener('click', checkEmailVerification);

    } catch (error) {
        document.getElementById('sign-up-result').innerText = error.message;
        console.error("Error creating user:", error);
    }
};

document.getElementById('get-user-doc-button').addEventListener("click", () => {
    console.log("starting to get data");
    getData();
    console.log("got Data successfully.");
});
//Check if User is not logged in or in group
checkIfNotLoggedIn();
function checkIfNotLoggedIn() {
    const user = auth.currentUser;
    // no logged in user
    if (!user) {
        console.log("no logged in user");
        //prompts sign in screen
        document.getElementById('sign-up-screen').style.display = 'flex';
        document.getElementById("toggle-password").addEventListener("click", () => {
            const isPassword = document.getElementById("passwordInput").type === "password";
            document.getElementById("passwordInput").type = isPassword ? "text" : "password";
            document.getElementById("toggle-password").textContent = isPassword ? "Hide Password" : "Show Password";
        });
        //sign in button push
        document.getElementById('sign-up-button').addEventListener('click', () => {
            if (document.getElementById('emailInput').value != "" && document.getElementById('usernameInput').value != "" && document.getElementById('passwordInput').value != "") {
                console.log("signing up!");
                //sign in and verify
                signUpAndVerify(document.getElementById('emailInput').value, document.getElementById('passwordInput').value, document.getElementById('usernameInput').value);
            } else {
                document.getElementById('sign-up-result').innerText = "Must enter stuff better.";
            }
        });
    }
    else {
        console.log("user is here" + user.uid);
        getData();
    }
}
//function to read data
async function getData() {
    const user = auth.currentUser;

    if (!user) {
        console.log("No user is signed in.");
        return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        console.log("User data:", data);
        // You can now use data.username, data.createdAt, etc.
    } else {
        console.log("No document found for this user.");
    }

}

// Function to update a user's details
//updateUser("USER_ID", { score: "", grid: ""});
//updateUsers display name and emailVerified
async function updateUser(updatedData) {
    const user = auth.currentUser;
    const userDoc = doc(db, "users", user.uid);

    try {
        await updateDoc(userDoc, updatedData);
        console.log("User updated!");
    } catch (error) {
        console.error("Error updating user: ", error);
    }
}

// Function to delete a user
async function deleteUser(userId) {
    const userDoc = doc(db, "users", userId);

    try {
        await deleteDoc(userDoc);
        console.log("User deleted!");
    } catch (error) {
        console.error("Error deleting user: ", error);
    }
}

onAuthStateChanged(auth, (user) => {
    console.log(user);
    if (user) {
        // const uid = user.uid;
        //document.getElementById("userId").innerText = `User ID: ${uid}`;
        console.log("User ID:", user.uid);
        document.getElementById("sign-up-screen").style.display = 'none';
        document.getElementById("join-group-screen").style.display = 'flex';
        document.getElementById('check-verification-button').addEventListener('click', checkEmailVerification);
        document.getElementById('resend-verification-button').addEventListener('click', async () => {
            try {
                await sendEmailVerification(user);
                console.log("Verification email sent");
            }
            catch (error) {
                console.log("error sending verifyemail: ", error);
            }
        });

        // Save some user data to Firestore
        // const userRef = doc(db, "users", uid);
        // addUser();
    } else {
        console.log("No User.");
        //document.getElementById("userId").innerText = "Not signed in";
    }
});


/*Wordle 1562 3/6
//⬜⬜⬜⬜🟩
//⬜⬜🟩⬜⬜
//🟩🟩🟩🟩🟩
*/


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
//clicking submit score button
document.getElementById('submit-score').addEventListener('click', submit);

async function submit() {
    //**ADD*CONFIRM THAT THE SUBMISSION IS FOR THE CURRENT DAY***/
    console.log(timeAgo("2021-06-19"));
    //can only submit the score if text is empty
    if (textareaEl.value == "") {
        try {
            //gets the users clipboard
            const pastedContent = await navigator.clipboard.readText();
            console.log(pastedContent);
            let splittedContent = pastedContent.split(" ");
            console.log(splittedContent);
            //checks if it's a wordle score
            if (splittedContent[0] == "Wordle" && splittedContent.length == 3) {
                if (timeAgo("2021-06-19") == splittedContent[1]) {
                    // Here, you can store or display the score in your app
                    textareaEl.value = pastedContent;
                    resultEl.textContent = `Your Wordle score: \n${pastedContent}`;

                    // Optionally, you could save it to a server or local storage
                    // Example: Save to localStorage
                    // localStorage.setItem('wordleScore', score);
                }
                else {
                    resultEl.innerText = "This is not the right wordle for the day.";
                }
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

//updates the date when re enter app
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        //Checks if the date is different
        checkIfNewDay();
    }
});

//Updates the date to change it while running
// setInterval(() => {
//     checkIfNewDay();
// }, 60000);

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
    if (days > 0) return days;
}
