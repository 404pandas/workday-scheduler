// variables to keep track of quiz state
    var currentQuestion = 0;
    var time = 60;
    var timer;
    

// variables to reference DOM elements
var questionsEl = document.getElementById('questions');


/* FUNCTION TO START THE QUIZ */
function startQuiz(event) {
    event.stopPropagation();
    // hide start screen
    document.getElementById('start-screen').className ="hide";

    // un-hide questions section
    document.getElementById('questions').className ="show";
    // start timer
    clockTick();

    getQuestion();
}

/* FUNCTION TO GET/SHOW EACH QUESTION */
function getQuestion() {
    // get current question object from array
    var questionValue = questions[currentQuestion];

    // update title with current question
    
    document.getElementById('question-title').textContent =  questionValue.title;

    // clear out ant old question choices
    document.getElementById('choices').innerHTML = '';

    // loop over choices
    for(var i=0;i<questionValue.choices.length;i++) {
        //create new button for each choice
        var btn = document.createElement("button");
        btn.textContent = i+1 + ". " +questionValue.choices[i];
        btn.setAttribute("data-index", i);
        //display on the page
        document.querySelector("#choices").appendChild(btn);
    }
}

/* FUNCTION FOR CLICKING A QUESTION */
function questionClick(event) {
    //event.stopPropagation();
    var element = event.target;
    // if the clicked element is not a choice button, do nothing.
    if (element.matches("button") !== true) {
    }
    else{
        var questionValue = questions[currentQuestion];
        // check if user guessed wrong
        if(questionValue.answer !== questionValue.choices[element.getAttribute("data-index")]){
            // penalize time
            if(time>10){
                time -= 10;
                // display new time on page
                document.getElementById("timeText").textContent = "Time: " + time;
            }
            else{
                time-=time;
                // display new time on page
                document.getElementById("timeText").textContent = "Time: " + time;
                quizEnd();
            }
            // give them feedback, letting them know it's wrong
            document.getElementById("feedback").textContent = "Incorrect!";
            document.getElementById("feedback").className = "show";
        }
        else{
            console.log("You guessed right!");
            // give them feedback, letting them know it's right
            document.getElementById("feedback").textContent = "Correct!";
            document.getElementById("feedback").className = "show";
            // move to next question
            currentQuestion++;
            if(currentQuestion>3){
                quizEnd()
            }
            else{
                getQuestion();
            }
        }
        
    }
}

/* FUNCTION TO END THE QUIZ */
function quizEnd() {
    // stop timer
    clearInterval(timer);
    // show end screen
    document.getElementById('end-screen').className ="show";
    // show final score
    document.getElementById("final-score").textContent = time;
    // hide questions section
    document.getElementById('questions').className ="hide";
    document.getElementById("feedback").className = "hide";
}

/* FUNCTION FOR UPDATING THE TIME */
function clockTick() {
     timer = setInterval(function() {
        
        time--;
        // update time
        document.getElementById("timeText").textContent = "Time: " + time;

        if (time === 0) {
            // Clears interval
            clearInterval(timer);
            quizEnd();
        }
      }, 1000);

}

function saveHighscore() {
    // get value of input box - for initials
    var initials = document.getElementById('initials').value;
    // format new score object for current user
    var currentScore = {init: initials, score: time};
    // get saved scores from localstorage, or if not any, set to empty array
    var savedScores = JSON.parse(localStorage.getItem("savedScores"));
        // make sure value wasn't empty
    if(initials === ""){
        alert ("You must enter your initials to save your score");
    }
    
    else{
        if (savedScores !== null) {
            savedScores.push(currentScore);
            // save to local storage
            localStorage.setItem("savedScores",JSON.stringify(savedScores));
        }
        else{
            savedScores = [currentScore];
            localStorage.setItem("savedScores", JSON.stringify(savedScores));
        }
            // redirect to next page
            document.location.href = "./highscores.html";
    }
}

/* CLICK EVENTS */
    // user clicks button to submit initials
    document.querySelector("#submit").addEventListener("click", saveHighscore);

    // user clicks button to start quiz
    document.querySelector("#start-quiz").addEventListener("click", startQuiz);

    // user clicks on element containing choices
    document.querySelector("#questions").addEventListener("click", questionClick);