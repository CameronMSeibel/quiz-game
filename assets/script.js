questionBox = document.getElementById("question-box");
timerBox = document.getElementById("timer-box");
startButton = document.getElementById("start-btn");

var GAME_LENGTH = 90;
var PENALTY = 10;
var QUESTION_LIST = [
    {
        question: "Commonly used data types DO NOT include the following:",
        a1: {
            text: "",
            value: false
        },
        a2: {
            text: "",
            value: false
        },
        a3: {
            text: "alerts",
            value: true
        },
        a4: {
            text: "",
            value: false
        }
    },
    {
        question: "The condition of an if/else statement is enclosed within:",
        a1: {
            text: "parentheses",
            value: true
        },
        a2: {
            text: "",
            value: false
        },
        a3: {
            text: "",
            value: false
        },
        a4: {
            text: "",
            value: false
        }
    },
    {
        question: "Arrays in JavaScript can be used to store:",
        a1: {
            text: "",
            value: false
        },
        a2: {
            text: "",
            value: false
        },
        a3: {
            text: "",
            value: false
        },
        a4: {
            text: "All of the above",
            value: true
        }
    },
    {
        question: "Strings must be enclosed with _ before being assigned to a variable.",
        a1: {
            text: "",
            value: false
        },
        a2: {
            text: "quotes",
            value: true
        },
        a3: {
            text: "",
            value: false
        },
        a4: {
            text: "",
            value: false
        }
    },
    {
        question: "A very useful tool during development and debugging for printing content to the debugger is:",
        a1: {
            text: "",
            value: false
        },
        a2: {
            text: "console.log",
            value: true
        },
        a3: {
            text: "",
            value: false
        },
        a4: {
            text: "",
            value: false
        }
    }
];

var playingGame = false;
var currentQuestion;
var t;
var questionOrder = [];

function startGame(){
    for(i = 0; i < QUESTION_LIST.length; i++){
        questionOrder.push(i);
    }
    questionOrder = shuffle(questionOrder);
    console.log(questionOrder);
    
    t = GAME_LENGTH;
    timerBox.innerText = `${t} seconds left!`;
    
    nextQuestion(questionOrder.pop());

    playingGame = true;

    gameInterval = setInterval(function(){
        t--;
        timerBox.innerText = `${t} seconds left!`;
        if(t === 0 || !playingGame){
            clearInterval(gameInterval);
            playingGame = false;
            timerBox.innerText = "";
        }
    }, 1000);
}

function checkAnswer(e){
    button = e.target;
    //For some reason clicking start button would otherwise reduce score by 10, despite playingGame being false.
    if(button.id === "start-btn"){
        return; 
    }
    if(button.matches("button") && playingGame){
        if(button.dataset.value !== "true"){
             t -= PENALTY;
        }
        if(questionOrder.length !== 0){
            nextQuestion(questionOrder.pop());
        }else{
            playingGame = false;
            handleScore(t);
        }
    }
}

function nextQuestion(index){
    currentQuestion = QUESTION_LIST[index];
    questionBox.innerHTML = `
    <p>${currentQuestion.question}</p>
    <button data-value=${currentQuestion.a1.value}>${currentQuestion.a1.text}</button>
    <button data-value=${currentQuestion.a2.value}>${currentQuestion.a2.text}</button>
    <button data-value=${currentQuestion.a3.value}>${currentQuestion.a3.text}</button>
    <button data-value=${currentQuestion.a4.value}>${currentQuestion.a4.text}</button>`;
}

function handleScore(score){
    questionBox.innerHTML = `
    <p>Congratulations! Your score was ${score}.<br>Would you like to save your score?</p>
    <button id="save">Yes</button>
    <button id="continue">No</button>`;

    document.getElementById("save").addEventListener("click", saveScore);
    document.getElementById("continue").addEventListener("click", promptNewGame);

    function saveScore(){

        questionBox.innerHTML = `
        <p>Please enter your initials:</p>
        <label for="initials">Initials:</label>
        <input id="initials" maxlength="3"></input> <!--- Max length of 3 like old arcade games. --->
        <button id="save">Save!</button>`;

        document.getElementById("save").addEventListener("click", function(){
            var initials = document.getElementById("initials").value;
            if(initials !== ""){
                
            }else{
                alert("Please enter your initials!")
            }
        })
    }

    function promptNewGame(){
        questionBox.innerHTML = `
        <p>Would you like to play again?</p>
        <button onclick="startGame()">Yes!<button>`;
    }
}

function shuffle(array) {
    var currentIndex = array.length;
    var randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

questionBox.addEventListener("click", checkAnswer);
startButton.addEventListener("click", startGame);