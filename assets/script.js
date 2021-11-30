questionBox = document.getElementById("question-box");
timerBox = document.getElementById("timer-box");
startButton = document.getElementById("start-btn");
leaderboardLink = document.getElementById("leaderboard-link")

var GAME_LENGTH = 90;
var PENALTY = 10;


var playingGame = false;
var currentQuestion;
var t;
var questionOrder = [];

/**
 * Begins a trivia game.
 */
function startGame(){
    for(i = 0; i < QUESTION_LIST.length; i++){
        questionOrder.push(i);
    }
    questionOrder = shuffle(questionOrder);
    console.log(questionOrder);
    
    t = GAME_LENGTH;
    timerBox.innerText = `${t} seconds left!`;
    
    printQuestion(questionOrder.pop());

    playingGame = true;

    gameInterval = setInterval(function(){
        timerBox.innerText = `${t} seconds left!`;
        if(t === 0 || !playingGame){
            clearInterval(gameInterval);
            playingGame = false;
        }        
        t--;
    }, 1000);
}

/**
 * Checks whether or not a user's response was correct.
 * @param {Element} e the element that triggered the event
 * @returns if an invalid (non-answer) button triggered the event
 */
function checkAnswer(e){
    button = e.target;
    //For some reason clicking start button would otherwise reduce score by 10 on game start, despite playingGame being false.
    if(button.id === "start-btn"){
        return; 
    }
    if(button.matches("button") && playingGame){
        if(button.dataset.value !== "true"){
             t -= PENALTY;
        }
        if(questionOrder.length !== 0){
            printQuestion(questionOrder.pop());
        }else{
            playingGame = false;
            handleScore(t);
        }
    }
}

/**
 * Displays the current trivia question on the webpage.
 * @param {*} index the index value of the question from the question list.
 */
function printQuestion(index){
    currentQuestion = QUESTION_LIST[index];
    questionBox.innerHTML = `
    <p>${currentQuestion.question}</p>
    <div id="answer-container">
    <button data-value=${currentQuestion.a1.value}>${currentQuestion.a1.text}</button>
    <button data-value=${currentQuestion.a2.value}>${currentQuestion.a2.text}</button>
    <button data-value=${currentQuestion.a3.value}>${currentQuestion.a3.text}</button>
    <button data-value=${currentQuestion.a4.value}>${currentQuestion.a4.text}</button>
    </div>`;
}

/**
 * Allows the user to decide whether or not to save their score to the leaderboard.
 * @param {number} score the score the player received on their quiz.
 */
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
            var entry = {initials: initials, score: score};
            if(initials !== ""){
                var scores = JSON.parse(localStorage.getItem("scores"));
                console.log(Array.isArray(scores));
                if(Array.isArray(scores)){
                    for(item of scores){
                        console.log(item.score < score);
                        if(item.score < score){
                            console.log(scores.indexOf(item));
                            scores.splice(scores.indexOf(item), 0, entry);
                            console.log(scores);
                            break;
                        }
                    }
                    console.log(!scores.includes(entry))
                    if(!scores.includes(entry)){
                        scores.push(entry);
                    }
                }else{
                    scores = [entry];
                }
                localStorage.setItem("scores", JSON.stringify(scores));
                printLeaderboard(scores);
            }else{
                alert("Please enter your initials!")
            }
        })
    }
}

/**
 * Prints the current leaderboard to the webpage.
 * @param {Object} scores the current list of scores.
 */
function printLeaderboard(scores){
    var leaderboard = `<ol id="leaderboard">`;
    if(scores !== []){
        for(item of scores){
            leaderboard += `<li>${item.initials}, ${item.score}</li>`
        }
    }
    leaderboard += `</ol><button id="continue">Continue</button><button id="clear">Clear Highscores</button>`;
    questionBox.innerHTML = leaderboard;
    document.getElementById("clear").addEventListener("click", function(){
        localStorage.setItem("scores", JSON.stringify([]));
        document.getElementById("leaderboard").innerHTML = "";
    })
    document.getElementById("continue").addEventListener("click", promptNewGame);
}

/**
 * A wrapper function to allow the leaderboard to be printed if a game has not yet been played.
 */
function printLeaderboardHelper(){
    var scores = localStorage.getItem("scores");
    if(Array.isArray(scores)){
        printLeaderboard(scores);
    }else{
        printLeaderboard([]);
    }
}

/**
 * Allows the user to begin another round of trivia.
 */
function promptNewGame(){
    questionBox.innerHTML = `
    <p>Would you like to play again?</p>
    <button id="start-btn">Yes!</button>`;
    document.getElementById("start-btn").addEventListener("click", startGame);
}

/**
 * Adapted from a thread on array randomization on StackOverflow
 * @param {Array} array an array of at least two objects
 * @returns a copy of array, except with all elements in a random order
 */
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
leaderboardLink.addEventListener("click", printLeaderboardHelper);