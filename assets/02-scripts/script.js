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

var questionList = [];

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
// Display question, start timer
// User answers question. update timer if wrong, continue countdown otherwise
// Update questions answered statistic

function initQuiz() {
    loadSettings();
    loadScores();
    loadQuestions();
}

function loadSettings() {

}

function loadScores() {

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

function updateTimer() {

}

/* Main function to control flow of the game*/
function playQuiz() {
    // Have a countdown?
    // Start Timer
}


/* Start the Quiz */
var startQuiz = document.getElementById("btn-quiz-start");
startQuiz.addEventListener("click", playQuiz);

/* DEV TEST SECTION */
var test = document.querySelector("#answer-1");
test.addEventListener("click", loadQuestions);

var test2 = document.querySelector("#answer-4");
test2.addEventListener("click", () => displayQuestion(        {
    "title": "Which of the following is not a valid data type in JavaScript?",
    "option_1": "Number",
    "option_2": "String",
    "option_3": "Boolean",
    "option_4": "Void",
    "answer": "Void"
}));