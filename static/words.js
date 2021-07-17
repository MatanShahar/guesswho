
class Application {
    constructor() {
        this.preloadWords();

        this.wordList = document.getElementById('list');
        this.wordInput = document.getElementById('word');

        const buttons = [1, 2, 3, 4, 5];
        for (let i = 0; i < buttons.length; i++) {
            const value = buttons[i];
            document.getElementById('add-' + value)
                .addEventListener('click', (_) => this.buttonClicked(value));
        }
    }

    buttonClicked(value) {
        const word = this.wordInput.value;
        this.addNewWord({ word: word, value: value });
    }

    preloadWords() {
        fetch('/word-list/custom-words')
            .then(words => words.json())
            .then(words => {
                const wordList = words['words'];
                for (let i = 0; i < wordList.length; i++) {
                    this.addWordToList(wordList[i]);
                }
            });
    }

    addNewWord(wordData) {
        this.sendWord(wordData);
        this.addWordToList(wordData);

        this.wordInput.focus();
    }

    addWordToList(wordData) {
        const {word, value} = wordData;
        const listItem = document.createElement('li');
        const wordSpan = document.createElement('span');
        const valueSpan = document.createElement('span');

        wordSpan.innerText = word;
        valueSpan.innerText = value.toString();
        valueSpan.className = 'vl' + value;

        listItem.appendChild(wordSpan);
        listItem.appendChild(valueSpan);

        this.wordList.insertBefore(listItem, this.wordList.firstChild);
        this.wordInput.value = '';
    }

    sendWord(wordData) {
        const response = fetch('/add-word/custom-words', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(wordData)
        });

        response.then(() => {});
    }
};

window.runApp = () => {
    const app = new Application();
};

console.log("loaded");
