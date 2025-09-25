document.getElementById('submit-score').addEventListener('click', function () {
    const score = document.getElementById('score-input').value;

    if (score) {
        // Here, you can store or display the score in your app
        document.getElementById('result').textContent = `Your Wordle score: \n${score}`;

        // Optionally, you could save it to a server or local storage
        // Example: Save to localStorage
        // localStorage.setItem('wordleScore', score);
    } else {
        alert('Please paste your Wordle score!');
    }
});

document.getElementById('check-for-score').addEventListener('click', readClipboard);

async function readClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        console.log('Clipboard contents:', text);
        document.getElementById('score-input').value = text;
    } catch (err) {
        console.error('Clipboard read failed:', err);
    }
}