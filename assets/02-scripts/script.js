/* Class Declarations */

// TODO: Create Quiz Class to handle questions
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

    static abortQuiz = new AbortController(); // TODO: Move this to the quiz class

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
        list.id = "quiz-answers";

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

    createEventListener(containerElement, questionIt) {
        if (timer.timeLeft <= 0) {
            Question.abortQuiz.abort();
            endQuiz();
        }
        var quiz = this.html.querySelector("#quiz-answers");
        var question = this;
        quiz.addEventListener("click", (event) => {
            if (event.target.innerText === question.answer) {
                // Update score
                // Display correct on bottom
                console.log("Correct");
            } else {
                // Update score
                // Display incorrect on bottom
                console.log("Incorrect");
                timer.update(-1 * settings.timePenalty);
            }
            Question.displayQuestion(containerElement, questionIt)
        }, 
        { once: true, signal: Question.abortQuiz.signal });
    }

    static displayQuestion(containerElement, questionIt) {
        if (timer.timeLeft <= 0) {
            Question.abortQuiz.abort();
            endQuiz();
        }
        containerElement.innerHTML = "";
        var nextQuestion = questionIt.next();
        if (nextQuestion.done) {
            console.log("Quiz Finished");
            timer.stop();
            exitQuiz();
            return;
        }
        var question = nextQuestion.value;
        containerElement.appendChild(question.html);
        question.createEventListener(containerElement, questionIt);
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
        // CHeck for local storage first
        var settingsData = await fetch("./assets/04-data/settings.json").then(response => response.json());
        Object.assign(this, settingsData);
        this.saveSettings();
    }

    saveSettings() {
        // Save to local storage
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

/* Variable Declarations */
var questionList = [];
var settings = new Settings();
var scoresList = [];
var timer = new Timer();
var quizButtons = document.getElementsByClassName("answer");
var quizContainer = document.getElementById("quiz-container");

/* Function declarations */
async function loadQuestions() {
    // CHeck for local storage first
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
    // CHeck for local storage first
    var scoresData = await fetch("./assets/04-data/scores.json").then(response => response.json());
    var scores= Object.keys(scoresData);
    for (var i = 0; i < scores.length; i++ ) {
        var temp = new Score();
        temp = Object.assign(temp, scoresData[scores[i]]);
        scoresList.push(temp);
    }
    saveScores(scoresList);
}

function saveQuestions(questions) {
    // Save to local storage
    localStorage.setItem("questions", JSON.stringify(questions));
}

function saveScores(scores) {
    // Save to local storage
    localStorage.setItem("scores", JSON.stringify(scores));
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

function* nextQuestion(list) {
    var questionsRemaining = list.length;
    for (var i = 0; i < list.length; i++) {
        if (timer.timeLeft <= 0) {
            Question.abortQuiz.abort();
            endQuiz();
            return questionsRemaining;
        }
        questionsRemaining--;
        yield list[i];
    }
    return questionsRemaining;
}

function playQuiz() {
    // Have a countdown?
    var quizContainer = document.getElementById("quiz-container");
    const questions = nextQuestion(questionList);
    timer.start();
    Question.displayQuestion(quizContainer, questions);
}

function endQuiz() {
    // Goto high score page when quiz ends. 
    // Reset HTML on index.html page. Just load the original html page?
    saveQuestions(questionList);
    saveScores(scoresList);
}

/* ROAD MAP */
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