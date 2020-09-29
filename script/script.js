const maxTime=2;
var timer=maxTime;  // How much time is left before the end of the game?
var qPos=0;     // Which question are we currently asking?
var questionsCorrect=0;
var questionsWrong=0;
var timerInterval;
var finalScore=0;

// ~~~===---...---===```===---...---===```===---...---===```
// ~~~                  init()                           ```
// ~~~                    Called by <body> .onload();    ```
// ~~~===---...---===```===---...---===```===---...---===```
function init(){
    document.querySelector("#timer").innerHTML="<h4 class='timer'>"+timer+"</h4>";
    loadQuestion(); 
    // Because we're setting this up in this function, we need to assign the interval
    // to a global variable. Otherwise, we won't be able to stop it when we need to.
    timerInterval=setInterval(updateTimer,1000);
}
// ~~~===---...---===```===---...---===```===---...---===```===---...
// ~~~   updateTimer()                                            ...
// ~~~   Advanced the clock, and also changes the background      ...
// ~~~   Called by the setInterval in init()                      ...
// ~~~===---...---===```===---...---===```===---...---===```===---...
function updateTimer(){
    timer--;
    if(timer<=0){
        // End the game--user loses
        document.querySelector("#timer").innerHTML="<i class='far fa-sad-tear h2'></i>";
        endGame();
    }
    else{
        // Put the new time up on the screen
        document.querySelector("#timer").innerHTML="<h4 class='timer'>"+timer+"</h4>";
        // Change the background opacity to match the percentage of remaining time.
        var backOp=timer/maxTime;
        document.querySelector("#backdrop").style.opacity=backOp;
    }
}


// ~~~===---...---===```===---...---===```===---...---===```===---...
// ~~~   loadQuestion()                                           ...
// ~~~   Fills in the question text, removes any previous answers ...
// ~~~   and makes new answer buttons.                            ...
// ~~~   Called by init() and ______                              ...
// ~~~===---...---===```===---...---===```===---...---===```===---...
function loadQuestion(){
    // First, check to see is the user has answered every question, in which case they win
    if(questionsCorrect>=questionArray.length){
        endGame();
    }
    // Then, check to see if we're out of questions, in which we can replay the questions the user missed
    else if(qPos>questionArray.length-1){
        qPos=0;
        console.log("resetting");
    }    
    else{
        // Finally, check to see if they have correctly answered this particular question already
        if(questionArray[qPos].userStatus){
            // They've already answered this one, so get the next question in the stack
            // This is a pretty inefficient way to do this (linked lists would be better, for a start)
            // But with so few questions it hardly matters
            loadQuestion();
        }
        else{
            // Update the question text
            document.querySelector("#q-num").textContent="Question #"+(qPos+1);
            document.querySelector("#q-text").textContent=questionArray[qPos].q;
            // Remove any previous question buttons
            // These folks suggested just using .innerHTML, althought they warned that 
            // using the browser's html engine isn't suitable for high-performance.
            // This quiz app is not high performance!
            // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript    
            var answerBox=document.querySelector("#q-answers");
            answerBox.innerHTML="";

            // Load new answer buttons
            var buttonNum=0;
            for(answer of questionArray[qPos].options)
            {
                makeAnswerButton(buttonNum, answerBox);
                buttonNum++;   
            }
        }
    }
}
// ~~~===---...---===```===---...---===```===---...---===
// ~~~   makeAnswerButton()                           ===  
// ~~~   Create a button that displays the text of the=== 
// ~~~   possible answer, and set its onClick to call ===
// ~~~   questionAnswered() with either true or false ===
// ~~~   Called by loadQuestion()                     ===
// ~~~===---...---===```===---...---===```===---...---===
function makeAnswerButton(buttonNum, buttonLocation){            
    var newButton=document.createElement("button");
    newButton.class="button";
    newButton.style.margin="5px";
    newButton.textContent=answer;
    // The index of the correct answer is stored as .correctAnswerIndex, so if the current button number
    // matches this value, we are in the process of creating the correct button
    if(buttonNum===questionArray[qPos].correctAnswerIndex) result=true;
    else result=false;
    buttonLocation.appendChild(newButton);

    // newButton.addEventListener("click",()=>{questionAnswered(result)});       That's not working for some reason
    if(result) newButton.addEventListener("click",()=>{questionAnswered(true)});       
    else newButton.addEventListener("click",()=>{questionAnswered(false)});      
}
// ~~~===---...---===```===---...---===```===---...---===```===---...
// ~~~   questionAnswered()                                       ...
// ~~~   The user has answered the question. Update the scores    ...
// ~~~   on whether the answer was correct or not, then increment ...
// ~~~   qPos and call loadQuestion again                         ...
// ~~~   Called by the answerButton's onClick()                   ...
// ~~~===---...---===```===---...---===```===---...---===```===---...
function questionAnswered(correctly){
    console.log(correctly);
    if(correctly){
        questionsCorrect++;
        questionArray[qPos].userStatus=true;
        document.querySelector("#correct").innerHTML="<h4>Correct: "+questionsCorrect+"</h4>";
    }
    else{
        questionsWrong++;
        timer--;
        
        document.querySelector("#timer").innerHTML="<i class='far fa-sad-tear h2'></i>";
        document.querySelector("#wrong").innerHTML="<h4>Incorrect: "+questionsWrong+"</h4>";
    }
    qPos++; 
    loadQuestion();
}
// ~~~===---...---===```===---...---===```===---...---===```===---...
// ~~~   endGame()                                                ...
// ~~~   Displays the final score.                                ...
// ~~~   Called by the updateTimer() and by loadQuestion()        ...
// ~~~===---...---===```===---...---===```===---...---===```===---...
function endGame(){
    clearInterval(timerInterval);
    // We either got here by answering every question correctly, or by running out of time
    
    document.querySelector("#q-num").textContent="Game Over";
    document.querySelector("#q-answers").remove();
    document.querySelector("#topInterface").style.display="none";
    finalScore=timer+questionsCorrect-questionsWrong;
    message=document.querySelector("#q-text");
    message.innerHTML="";
    message.innerHTML="<h3>User Score</h3>";
    message.innerHTML+="<div><strong>Time: </strong>"+timer+"</div>";
    message.innerHTML+="<div><strong>Plus correct questions: </strong>"+questionsCorrect+"</div>";
    message.innerHTML+="<div style='border-bottom'><strong>Minus incorrect questions: </strong>"+questionsWrong+"</div>";
    message.innerHTML+="<div><strong>Final Score: </strong>"+finalScore+"</div>";
    message.innerHTML+="<div>Please enter your name!</div>";
    message.innerHTML+="<div class='row'><div class='col-8'><input type='text' id='userName'>";
    message.innerHTML+="<div class='col-4'><input type='submit' onclick='displayScore();'></div></div>";
}

function displayScore(e){
    
    e.preventDefault(); // The page doesn't seem to be reloading when I run it, but just to be safe let's make sure
    
    var userName=document.querySelector("#userName").value;
    if(userName!=""){
        document.querySelector("#q-num").textContent="High Scores";
        message=document.querySelector("#q-text");
        message.innerHTML="";
        message.innerHTML+="<div class='row'><div class='col-8'>Name</div><div class='col-4'>Score</div></div>";
        message.innerHTML+="<div class='row'><div class='col-8'>Name</div><div class='col-4'>Score</div></div>";
        message.innerHTML+="<div class='row'><div class='col-8'>Name</div><div class='col-4'>Score</div></div>";
        message.innerHTML+="<div class='row'><div class='col-8'>Name</div><div class='col-4'>Score</div></div>";
        message.innerHTML+="<div class='row'><div class='col-8'>Name</div><div class='col-4'>Score</div></div>";
        message.innerHTML+="<div class='row'><div class='col-8'>Name</div><div class='col-4'>Score</div></div>";
        message.innerHTML+="<div class='row'><div class='col-8'>Name</div><div class='col-4'>Score</div></div>";
    }
}