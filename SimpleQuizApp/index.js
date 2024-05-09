// https://opentdb.com/api.php?amount=15
// const APIUrl =  'https://opentdb.com/api.php?amount=15&category=18&difficulty=medium&type=multiple';


const question = document.getElementById('question');
const quizOptions = document.querySelector('.quiz-options');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');
const checkBtn = document.getElementById('check-answer');
const playAgain = document.getElementById('play-again');
const result = document.getElementById('result');

let correctAnswer = "";
let optionList = "";
let correctScore = askedCount = 0;
let totalQuestion = 15;


// event listener
function eventListeners(){
    checkBtn.addEventListener('click',checkAnswer);
    playAgain.addEventListener('click',restartQuiz);
}

document.addEventListener('DOMContentLoaded',() => {

    loadQuestion();
    eventListeners();

    _totalQuestion.textContent = `${totalQuestion}`;
    _correctScore.textContent =`${correctScore}`;


});

async function loadQuestion(){
    const APIUrl =  'https://opentdb.com/api.php?amount=15';
    const result = await fetch(`${APIUrl}`);
    const data = await result.json();

    result.innerHTML = "";
    showQuestion(data.results[0]);
}

//display question and option
function showQuestion(data){
    checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    // console.log(correctAnswer);
    let incorrectAnswer = data.incorrect_answers;
    // console.log(incorrectAnswer);
    optionList = incorrectAnswer;
    //learn a little about splice method
    optionList.splice(Math.floor(Math.random() + (incorrectAnswer.length + 1)), 0, correctAnswer);
    //inserting correct Answer in random position in the option list 
    // console.log(optionList);
    // console.log(correctAnswer);

    question.innerHTML = `${data.question} <br> <span class = "category">${data.category} </span> `;

    quizOptions.innerHTML = ` 
        ${optionList.map((Option, index) => `
            <li> ${index + 1}. <span> ${Option} </span> </li>
        `).join('')}
    `;

    selectOption();
}

function selectOption(){
    quizOptions.querySelectorAll('li').forEach((Option) => {
        Option.addEventListener('click', () => {
            if(quizOptions.querySelector('.selected')){
                const activeOption = quizOptions.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            Option.classList.add('selected');
        });
    });

    console.log(correctAnswer);
}

//check answer

function checkAnswer(){
    checkBtn.disabled = true;
    if(quizOptions.querySelector('.selected')){
        let selectedAnswer = quizOptions.querySelector('.selected span').textContent;
        // console.log(selectedAnswer);
        if(selectedAnswer.trim() == HTMLDecode(correctAnswer)){
            correctScore++;
            result.innerHTML = `<p> <i class = "fas fa-check"></i> Correct Answer ! </p> `;
        }
        else{
            result.innerHTML = `<p> <i class = "fas fa-times"></i> Incorrect Answer !</p> <p> <small><b>Correct Answer : </b> ${correctAnswer} </small>  </p> `;

        }
        checkCount();
    }
    else{
        result.innerHTML = `<p> <i class = "fas fa-question" </i> <small>Please select an option!</small> </p>`
        checkBtn.disabled = false;
    }
}

//to convert html entities into normal text of correct answer if there is any

function HTMLDecode(textString){
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
        result.innerHTML += `<p> Your Score is ${correctScore}. </p>`
        playAgain.style.display = "block";
        checkBtn.style.display = "none";
    }
    else{
        setTimeout(() => {
            loadQuestion();
        }, 300);
    }
}

function setCount(){
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

function restartQuiz(){
    correctScore = askedCount = 0;
    playAgain.style.display = "none";
    checkBtn.disabled = false;
    setCount();
    loadQuestion();
}