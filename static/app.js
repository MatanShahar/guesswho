const zeroPad = (num, places) => String(num.toFixed(0)).padStart(places, '0');

class Application {
    currentWord = "test";
    timeLeft = 60;

    defaultRoundDuration;
    gameOver;

    roundStartTime;
    roundDuration;
    roundPoints;

    currentInterval;

    constructor(duration) {
        this.wordSlot = document.getElementById('word-slot');
        this.progressBar = document.getElementById('progress');
        this.progressText = document.getElementById('progress-text');
        this.screen = document.getElementById('screen');

        this.screen.addEventListener('click', (ev) => this.nextRound());

        this.defaultRoundDuration = duration;
        this.gameOver = true;

        this.newGameScreen();
    }

    newGameScreen() {
        this.wordSlot.innerText = 'GO!';
        this.screen.style.background = 'lime';
    }

    nextRound() {
        if (!this.gameOver) {
            this.roundDuration += 10;
            this.roundPoints += 10;
        }

        if (this.gameOver) {
            this.resetRound()
        }

        this.getWord().then(word => this.startRound(word));
    }

    resetRound() {
        this.roundStartTime = this.timeSeconds();
        this.roundDuration = this.defaultRoundDuration;
        this.roundPoints = 0;
        this.gameOver = false;
    }

    startRound(word) {
        this.currentWord = word;
        this.wordSlot.innerText = this.currentWord;
        this.screen.style.background = '';

        this.currentInterval = setInterval(() => {
            this.updateRoundProgress();
        }, 0.1);
    }

    endRound() {
        clearInterval(this.currentInterval);

        this.wordSlot.innerText = this.roundPoints + ' points!';
        this.screen.style.background = 'aquamarine';

        this.progressText.innerText = '00:00';
        this.progressBar.style.width = "100%";

        this.gameOver = true;
    }

    updateRoundProgress() {
        const currentTime = this.timeSeconds();
        const timePassed = currentTime - this.roundStartTime;
        const timeLeft = this.roundDuration - timePassed;

        if (timeLeft <= 0) {
            this.endRound();
            return;
        }

        const currentProgress = timePassed / this.roundDuration;
        const fixedProgress = Math.min(1, currentProgress) * 100;
        this.progressBar.style.width = fixedProgress + "%";

        const minutesLeft = Math.floor(timeLeft / 60);
        const secondsLeft = Math.ceil(timeLeft % 60);

        this.progressText.innerText = `${zeroPad(minutesLeft, 2)}:${zeroPad(secondsLeft, 2)}`;
    }

    timeSeconds() {
        return new Date().getTime() / 1000;
    }

    getWord() {
        return fetch(`/word`).then(resp => resp.text());
    }
};

window.runApp = () => {
    const pathSegments = location.pathname.split('/');
    const duration = parseFloat(pathSegments[pathSegments.length - 1]);
    const app = new Application(duration);
    app.newGameScreen();
};

console.log("loaded");
