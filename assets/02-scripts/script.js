/* Question Class Declaration */
// class Question {
//     constructor(title = "", option_1 = "", option_2 = "", option_3 = "", option_4 = "", answer = "") {
//         this.title = title;
//         this.option_1 = option_1;
//         this.option_2 = option_2;
//         this.option_3 = option_3;
//         this.option_4 = option_4;
//         this.answer = answer;
//     }
// };

// var questionList = [];

// async function loadQuestions() {
//     var response = await fetch("./assets/04-data/questions.json").then(response => response.json());
//     var questions = Object.keys(response);
//     for (var i = 0; i < questions.length; i++ ) {
//         var temp = new Question();
//         temp = response[questions[i]];
//         questionList.push(temp);
//     }
// };

// console.log(response[questions[i]]);
// console.log(questionList[i].title);

function randomizeList(list) {
    console.log(list);
    var temp;
    for (var i = 0; i < list.length; i++) {
        var random1 = randomInt(list.length);
        var random2 = randomInt(list.length);
        console.log(random1);
        console.log(random2);
        
        temp = list[random1];
        list[random1] = list[random2];
        list[random2] = temp;
    }
    console.log(list);
    return list;
}

function randomInt(range) {
    return Math.floor(Math.random() * range);
}


/* DEV TEST SECTION */
var test = document.querySelector("#answer-1");

test.addEventListener("click", loadQuestions);

questionList = randomizeList(questionList);