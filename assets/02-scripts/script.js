/* Class Declarations */
class Question {
    constructor(title = "", option_1 = "", option_2 = "", option_3 = "", option_4 = "", answer = "") {
        this.title = title;
        this.option_1 = option_1;
        this.option_2 = option_2;
        this.option_3 = option_3;
        this.option_4 = option_4;
        this.answer = answer;
    }

    randomizeOptions () {
        var options = [this.option_1, this.option_2, this.option_3, this.option_4];
        randomizeList(options);
        this.option_1 = options[0];
        this.option_2 = options[1];
        this.option_3 = options[2];
        this.option_4 = options[3];
    }

    generateQuestionHTML(quizElement) {
        quizElement.innerHTML = "";
        quizElement.appendChild(document.createElement('section'))
    }
};

class Timer {
    constructor(time = 60, interval = 1){
        this.initialTime = time;
        this.timeLeft = time;
        this.interval = interval;
        this.timer;
    }
    
    setElement(element) {
        this.element = element;
    }

    getElement() {
        return this.element;
    }

    start() {
        var timerObj = this;
        this.timer = setInterval(() => timerObj.update(-1), timerObj.interval * 1000);
    }
    
    update(changeTime = -1) {
        this.timeLeft += changeTime;
        this.element.innerHTML = this.timeLeft;
    }

    stop() {
        clearInterval(this.timer);
    }
};

class Settings {
    constructor(time = 60, penalty = 1, questionCount = 5) {
        this.quizTime = time;
        this.timePenalty = penalty;
        this.numQuestions = questionCount;
    }
};

class Score {
    constructor(initials = "", score = "", entry = "") {
        this.initials = initials;
        this.score = score;
        this.entry = entry;
    }
}

/* Variable Declarations */
var questionList = [];
var settings = new Settings();
var scoresList = [];
var timer = new Timer();
var quizButtons = document.getElementsByClassName("answer");
var quizContainer = document.getElementById("quiz-container");

/* Function declarations */
async function loadQuestions() {
    var questionData = await fetch("./assets/04-data/questions.json").then(response => response.json());
    var questions = Object.keys(questionData);
    for (var i = 0; i < questions.length; i++ ) {
        var temp = new Question();
        temp = Object.assign(temp, questionData[questions[i]]);
        temp.randomizeOptions();
        questionList.push(temp);
    }
    randomizeList(questionList);
};

async function loadSettings() {
    var settingsData = await fetch("./assets/04-data/settings.json").then(response => response.json());
    Object.assign(settings, settingsData);
}

async function loadScores() {
    var scoresData = await fetch("./assets/04-data/scores.json").then(response => response.json());
    var scores= Object.keys(scoresData);
    for (var i = 0; i < scores.length; i++ ) {
        var temp = new Score();
        temp = Object.assign(temp, scoresData[scores[i]]);
        scoresList.push(temp);
    }
}

function saveQuestions() {
    
}

function saveSettings() {

}

function saveScores() {

}

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

async function initQuiz() {
   
    await loadSettings();
    await loadScores();
    await loadQuestions();
    
    timer.initialTime = settings.quizTime;
    timer.timeLeft = settings.quizTime;
    timer.interval = settings.timePenalty;

    // Terrible practice as this has no modularity if the HTML changes, but it'll do for now.
    timer.setElement(document.querySelector("#timer"));
    timer.getElement().innerHTML = timer.timeLeft;
}

function displayQuestion(question) {
    var quizSection = document.getElementById("question");
    var title = quizSection.getElementsByTagName("h2")[0];
    var options = quizSection.getElementsByClassName("answer");
    var listItem;

    title.textContent = question.title;
    for (var i = 0; i < options.length; i++) {
        listItem = options[i].querySelector("button");
        listItem.innerHTML = question["option_" + (i + 1) + ""];
    }
}

function displayNextQuestion() {
    displayQuestion(questionList[0]);
}

function playQuiz() {
    // Have a countdown?
    generateEventListeners();
    displayNextQuestion();
    timer.start();
}

function generateEventListeners() {
    for (var i = 0; i < quizButtons.length; i++) {
        quizButtons[i].addEventListener("click", submitAnswer);
    }
}

function submitAnswer(event) {
    
}

/* ROAD MAP */
// User answers question
// Update timer if wrong, continue countdown otherwise
// Move to next question
// Display correct or incorrect below options on next question
// When number of questions is finished or time runs out, display score

// Update loading methods to save to local storage (settings and scores)
// Implement methods to save settings and scores. 

initQuiz();

var startQuiz = document.getElementById("btn-quiz-start");
startQuiz.addEventListener("click", playQuiz);











/* DEV TEST SECTION */
var test = document.querySelector("#answer-1");
test.addEventListener("click", loadScores);

var test3 = function() {
    console.log("Hello, World!");
}