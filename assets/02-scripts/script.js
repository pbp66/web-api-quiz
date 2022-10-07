/* Class Declarations */
class Question {
    constructor(title = "", option1 = "", option2 = "", option3 = "", option4 = "", answer = "") {
        this.title = title;
        this.option1 = option1;
        this.option2 = option2;
        this.option3 = option3;
        this.option4 = option4;
        this.answer = answer;
        this.html;
    }

    randomizeOptions () {
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
        var questionProperties = Object.keys(this);

        quiz.className = "quiz";
        quiz.id = "question";
        title.innerHTML = this.title;
        title.id = "quiz-title";

        quiz.appendChild(title);

        for (var i = 0; i < 4; i++) { // TODO: Generate number of options for flexible use cases instead of hard value
            var listItem = document.createElement("li");
            var button = document.createElement("button");

            listItem.className = "answer";
            listItem.id = questionProperties[i + 1];
            button.innerHTML = this[questionProperties[i + 1]];
            listItem.appendChild(button);
            list.appendChild(listItem);
        }

        quiz.appendChild(list);
        this.html = quiz;
    }

    displayQuestion(containerElement) {
        containerElement.innerHTML = "";
        containerElement.appendChild(this.html);
        this.createEventListeners();
    }

    createEventListeners() {
        var options;
        options = this.html.getElementsByClassName("answer");
        for (var i = 0; i < options.length; i++) { // TODO: Generate number of options for flexible use cases instead of hard value
            options[i].addEventListener("click", this.submitAnswer);
        }
    }

    submitAnswer(event) {
        console.log(event.target)
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
        this.loadSettings();
    }

    async loadSettings() {
        var settingsData = await fetch("./assets/04-data/settings.json").then(response => response.json());
        Object.assign(this, settingsData);
    }

    saveSettings() {

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
    var questions = [];
    await fetch("./assets/04-data/questions.json")
        .then(response => response.json())
        .then(questionData => {
            questions = Object.keys(questionData);
            for (var i = 0; i < questions.length; i++ ) {
                var temp = new Question();
                Object.assign(temp, questionData[questions[i]]);
                temp.randomizeOptions();
                temp.createHTML();
                questionList.push(temp);
            }
            randomizeList(questionList);
        });
};

async function loadScores() {
    var scoresData = await fetch("./assets/04-data/scores.json").then(response => response.json());
    var scores= Object.keys(scoresData);
    for (var i = 0; i < scores.length; i++ ) {
        var temp = new Score();
        temp = Object.assign(temp, scoresData[scores[i]]);
        scoresList.push(temp);
    }
}

function saveQuestions(questions) {

}

function saveScores(scores) {

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
   
    await loadScores();
    await loadQuestions();
    
    timer.initialTime = settings.quizTime;
    timer.timeLeft = settings.quizTime;
    timer.interval = settings.timePenalty;

    // Terrible practice as this has no modularity if the HTML changes, but it'll do for now.
    timer.setElement(document.querySelector("#timer"));
    timer.getElement().innerHTML = timer.timeLeft;
}

function playQuiz() {
    // Have a countdown?
    var quizContainer = document.getElementById("quiz-container");
    questionList[0].displayQuestion(quizContainer);
    timer.start();
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



var test3 = function() {
    console.log("Hello, World!");
}