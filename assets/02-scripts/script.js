/* Question Class Declaration */
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
};

class Timer {
    constructor(time = 60, interval = 1){
        this.initialTime = time;
        this.timeLeft = time;
        this.interval = interval;
        this.timer;
        this.element;
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

var questionList = [];
var settings = new Settings();
var scoresList = [];

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

/* ROAD MAP */
// Load settings, questions, scores
// Click Play
// User answers question. update timer if wrong, continue countdown otherwise
// Update questions answered statistic

function initQuiz() {
    loadSettings();
    loadScores();
    loadQuestions();
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

/* Main function to control flow of the game*/
function playQuiz() {
    initQuiz();
    // Have a countdown?

    console.log("It's Quiz Time!");

    var timer = new Timer(60, 1);
    timer.setElement(document.querySelector("#timer"));
    displayQuestion(questionList[0]);

    timer.start();
    // while (timer.timeLeft >= 0) {
    //     console.log(timer.timeLeft);
    // }
    timer.stop();
}

/* Start the Quiz */
var startQuiz = document.getElementById("btn-quiz-start");
startQuiz.addEventListener("click", playQuiz);

/* DEV TEST SECTION */
var test = document.querySelector("#answer-1");
test.addEventListener("click", loadScores);

var test2 = document.querySelector("#answer-4");
test2.addEventListener("click", () => displayQuestion(        {
    "title": "Which of the following is not a valid data type in JavaScript?",
    "option_1": "Number",
    "option_2": "String",
    "option_3": "Boolean",
    "option_4": "Void",
    "answer": "Void"
}));