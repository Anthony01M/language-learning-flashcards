document.addEventListener('DOMContentLoaded', function () {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#000000', '#FF5733', '#FF8C00', '#FFD700', '#ADFF2F', '#00FF7F', '#00CED1', '#1E90FF', '#9370DB', '#FF1493', '#000000'];
    let colorIndex = 0;

    setInterval(() => {
        document.body.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
    }, 5000);

    const vocabularyForm = document.getElementById('vocabularyForm');
    const startQuizButton = document.getElementById('startQuizButton');
    const viewVocabularyButton = document.getElementById('viewVocabularyButton');
    const quizModal = document.getElementById('quizModal');
    const vocabularyListModal = document.getElementById('vocabularyListModal');
    const closeModalButtons = document.querySelectorAll('.modal .close');
    const quizWord = document.getElementById('quizWord');
    const quizAnswerInput = document.getElementById('quizAnswerInput');
    const submitAnswerButton = document.getElementById('submitAnswerButton');
    const quizResult = document.getElementById('quizResult');
    const vocabularyList = document.getElementById('vocabularyList');

    let vocabularyData = JSON.parse(localStorage.getItem('vocabularyData')) || [];
    let currentQuizIndex = null;

    vocabularyForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const word = document.getElementById('wordInput').value;
        const translation = document.getElementById('translationInput').value;

        addVocabularyData(word, translation);
        vocabularyForm.reset();
    });

    startQuizButton.addEventListener('click', function () {
        startQuiz();
    });

    viewVocabularyButton.addEventListener('click', function () {
        updateVocabularyList();
        vocabularyListModal.style.display = 'block';
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', function () {
            button.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', function (event) {
        if (event.target == quizModal || event.target == vocabularyListModal) {
            event.target.style.display = 'none';
        }
    });

    submitAnswerButton.addEventListener('click', function () {
        checkAnswer();
    });

    function addVocabularyData(word, translation) {
        vocabularyData.push({ word, translation });
        localStorage.setItem('vocabularyData', JSON.stringify(vocabularyData));
    }

    function startQuiz() {
        if (vocabularyData.length === 0) {
            alert('No vocabulary available. Please add some vocabulary first.');
            return;
        }
        currentQuizIndex = Math.floor(Math.random() * vocabularyData.length);
        const vocabulary = vocabularyData[currentQuizIndex];
        quizWord.textContent = vocabulary.word;
        quizAnswerInput.value = '';
        quizResult.textContent = '';
        quizModal.style.display = 'block';
    }

    function checkAnswer() {
        const answer = quizAnswerInput.value.trim().toLowerCase();
        const correctAnswer = vocabularyData[currentQuizIndex].translation.trim().toLowerCase();
        if (answer === correctAnswer) {
            quizResult.textContent = 'Correct!';
            quizResult.style.color = 'green';
        } else {
            quizResult.textContent = `Incorrect. The correct translation is "${vocabularyData[currentQuizIndex].translation}".`;
            quizResult.style.color = 'red';
        }
    }

    function updateVocabularyList() {
        vocabularyList.innerHTML = '';
        vocabularyData.forEach((vocabulary, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${vocabulary.word} - ${vocabulary.translation}`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete');
            deleteButton.addEventListener('click', () => removeVocabularyData(index));
            listItem.appendChild(deleteButton);
            vocabularyList.appendChild(listItem);
        });
    }

    function removeVocabularyData(index) {
        vocabularyData.splice(index, 1);
        localStorage.setItem('vocabularyData', JSON.stringify(vocabularyData));
        updateVocabularyList();
    }
});