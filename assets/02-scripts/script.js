/* Question Class Declaration */

function Question(title = "", option_1 = "", option_2 = "", option_3 = "", option_4 = "", answer = "") {
    this.title = title;
    this.option_1 = option_1;
    this.option_2 = option_2;
    this.option_3 = option_3;
    this.option_4 = option_4;
    this.answer = answer;
};

function loadQuestions() {
    var response = fetch("./assets./04-data./questions.json");
    var questions = response.json();
    console.log(questions);
};