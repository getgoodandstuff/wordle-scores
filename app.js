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

