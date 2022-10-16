/* Class Declarations */
class Quiz {
    // Private Object Properties
    #controller;
    #questionIt;
    #timeOut;
    
    // Object Properties
    currentUserAnswer;
    userAnswerList = [];
    questionList = [];
    scoresList = [];
    questionsRemaining;
    settings;
    timer;
    score;

    // Object Constructor
    constructor() {
        this.quizContainer = document.getElementById("quiz-container"); 
        this.#questionIt = this.nextQuestion();
        this.#controller = new AbortController();
    }

    // Object Methods
    async init() {
        await this.loadScores();
        await this.loadQuestions();
        await this.loadSettings();

        this.timer = new Timer(this.settings.quizTime);

        this.score = this.timer.timeLeft;

        this.settings.questionCount = this.questionList.length;
        this.questionsRemaining = this.questionList.length;
        this.timer.setElement(document.querySelector("#timer"));
    }
    
    async play() {
        await this.init();
        var startQuiz = document.getElementById("btn-quiz-start");
        startQuiz.addEventListener("click", this.start.bind(this));
    }

    end() {
        this.timer.stop();
        // TODO: When number of questions is finished or time runs out, display score.
        // TODO: Add score entry then, goto high score page. Add score to scoresList
        // TODO: Add button to take quiz again. 
        // TODO: Reset HTML on index.html page. Just load the original html page?
        this.saveQuestions();
        this.saveScores();
    }

    start() {
        this.#startTimer();
        this.displayQuestion();
    }

    displayQuestion() {
        // TODO: Display correct or incorrect below options on next question. See createQuestionListener to potentially store the userAnswer
        this.checkTime();

        var currentQuestion = {};
        var nextQuestion = this.#questionIt.next();
        this.quizContainer.innerHTML = "";

        if (nextQuestion.done) {
            console.log("Quiz Finished");
            this.end();
            return;
        }

        currentQuestion = nextQuestion.value;
        this.quizContainer.appendChild(currentQuestion.html);
        this.createQuestionListener(currentQuestion);
    }

    * nextQuestion() {
        this.questionsRemaining = this.questionList.length;
        for (var i = 0; i < this.questionList.length; i++) {
            if (timer.timeLeft <= 0) {
                this.abortQuiz();
                return this.questionsRemaining;
            }
            this.questionsRemaining--;
            yield this.questionList[i];
        }
        return this.questionsRemaining;
    }

    createQuestionListener(question) {
        this.checkTime();
        var quiz = question.html.querySelector("#quiz-answers");
        quiz.addEventListener("click", ((event) => {
            if (event.target.innerText === question.answer) {
                // Update score
                this.currentUserAnswer = "Correct";
                console.log("Correct");
            } else {
                // Update score
                this.currentUserAnswer = "Incorrect";
                console.log("Incorrect");
                this.#updateTimer();
            }
            this.userAnswerList.push(this.currentUserAnswer); // TODO: Is this useful?
            this.displayQuestion();
        }).bind(this), 
        { once: true, signal: this.#controller.signal });
    }

    async loadQuestions() {
        var questionsData = localStorage.getItem("questions");

        // If local storage does not exist, load defaults. 
        if (questionsData === null || questionsData === "undefined") { 
            questionsData = await fetch("./assets/04-data/questions.json")
                .then(response => response.json());

        } else {
            questionsData = JSON.parse(questionsData);
        }

        var questionKeys = Object.keys(questionsData);
        for (var i = 0; i < questionKeys.length; i++ ) {
            var temp = new Question();
            Object.assign(temp, questionsData[questionKeys[i]]);
            temp.randomizeOptions();
            temp.createHTML();
            this.questionList.push(temp);
        }

        randomizeList(this.questionList);
    }

    async loadScores() {
        var scoresData = localStorage.getItem("scores");
        
        // If local storage does not exist, load defaults. 
        if (scoresData === null || scoresData === "undefined") {
            scoresData = await fetch("./assets/04-data/scores.json")
                .then(response => response.json());
        } else {
            scoresData = JSON.parse(scoresData);
        }
        var scoreKeys = Object.keys(scoresData);
        for (var i = 0; i < scoreKeys.length; i++ ) {
            this.scoresList.push(
                Object.assign(new Score(), scoresData[scoreKeys[i]])
            );
        }

        this.saveScores(this.scoresList);
    }

    async loadSettings() {
        this.settings = new Settings();
    }

    saveQuestions() {
        localStorage.setItem("questions", JSON.stringify(this.questionList));
    }
    
    saveScores() {
        localStorage.setItem("scores", JSON.stringify(this.scoresList));
    }

    checkTime() {
        if (this.timer.timeLeft <= 0) {
            this.#abortQuiz();
            this.end();
        }
        return;
    }

    // Private Object Methods
    #abortQuiz() {
        this.#controller.abort();
    }
    
    #startTimer() {
        this.timer.start();
        this.#startTimeOut();
    }

    #updateTimer() {
        this.timer.update(-1 * this.settings.timePenalty);
        this.#updateTimeOut();
    }

    #stopTimer() {
        this.timer.stop();
    }

    #startTimeOut() {
        this.#timeOut = setTimeout(() => 
            this.end().bind(this), 
            this.timer.interval * 1000);
    }

    #updateTimeOut() {
        this.#timeOut = setTimeout(() => 
            this.end().bind(this), 
            this.timer.timeLeft * 1000);
    }

    #stopTimeOut() {

    }
}
class Question {
    html;
    
    constructor(title = "", option1 = "", option2 = "", option3 = "", option4 = "", answer = "") {
        this.title = title;
        this.option1 = option1;
        this.option2 = option2;
        this.option3 = option3;
        this.option4 = option4;
        this.answer = answer;
    }

    randomizeOptions() {
        var options = [this.option1, this.option2, this.option3, this.option4];
        randomizeList(options);
        this.option1 = options[0];
        this.option2 = options[1];
        this.option3 = options[2];
        this.option4 = options[3];
    }

    createHTML() {
        var quiz = document.createElement("section");
        var title = document.createElement("h2");
        var list = document.createElement("ul");
        var questionProperties = ["option1", "option2", "option3", "option4"];

        quiz.className = "quiz";
        quiz.id = "question";
        title.innerHTML = this.title;
        title.id = "quiz-title";
        list.id = "quiz-answers";

        quiz.appendChild(title);

        for (var i = 0; i < questionProperties.length; i++) {
            var listItem = document.createElement("li");
            var button = document.createElement("button");
            listItem.className = "answer";
            listItem.id = questionProperties[i];
            button.innerHTML = this[questionProperties[i]];
            listItem.appendChild(button);
            list.appendChild(listItem);
        }

        quiz.appendChild(list);
        this.html = quiz;
    }
};

class Timer {
    #timer;

    constructor(time = 60, interval = 1){
        this.initialTime = time;
        this.timeLeft = time;
        this.interval = interval;
    }
    
    setElement(element) {
        element.innerHTML = this.timeLeft;
        this.element = element;
    }

    getElement() {
        return this.element;
    }

    start() {  
        this.#timer = setInterval((() => 
            this.update(-1)).bind(this), 
            this.interval * 1000);
    }
    
    update(changeTime = -1) {
        this.timeLeft += changeTime;
        this.element.innerHTML = this.timeLeft;
    }

    stop() {
        clearInterval(this.#timer);
    }
};

class Settings {
    constructor(time = 60, penalty = 1, questionCount = 5) {
        this.quizTime = time;
        this.timePenalty = penalty;
        this.numQuestions = questionCount;
        this.loadSettings();
    }

    async loadSettings() {
        var settingsData = localStorage.getItem("settings");

        // If local storage does not exist, load defaults. 
        if (settingsData === null) {
            settingsData = await fetch("./assets/04-data/settings.json")
                .then(response => response.json());
        } else {
            settingsData = JSON.parse(settingsData);
        }
        
        Object.assign(this, settingsData);
        this.saveSettings();
    }

    saveSettings() {
        localStorage.setItem("settings", JSON.stringify(this));
    }
};

class Score {
    constructor(initials = "", score = "") {
        this.initials = initials;
        this.score = score;
        this.entry = "" + initials + " - " + score;
    }
}

/* Global Variable Declarations */
// None
/* Global Function Declarations */
function randomizeList(list) {
    var temp;
    for (var i = 0; i < list.length; i++) {
        var random1 = randomInt(list.length);
        var random2 = randomInt(list.length);
        temp = list[random1];
        list[random1] = list[random2];
        list[random2] = temp;
    }
}

function randomInt(range) {
    return Math.floor(Math.random() * range);
}

/* Main Code Execution */
/* ROAD MAP */
// TODO: Display correct or incorrect below options on next question
// TODO: When number of questions is finished or time runs out, display score

var quiz = new Quiz();
quiz.play();