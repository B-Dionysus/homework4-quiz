const maxTime=2;
var timer=maxTime;  // How much time is left before the end of the game?
var qPos=0;     // Which question are we currently asking?
var questionsCorrect=0;
var questionsWrong=0;
var timerInterval;
var finalScore=0;
var userHighScore;

// ~~~===---...---===```===---...---===```===---...---===```
// ~~~                  init()                           ```
// ~~~                    Called by <body> .onload();    ```
// ~~~===---...---===```===---...---===```===---...---===```
function init(){
    document.querySelector("#timer").innerHTML="<h4 class='timer'>"+timer+"</h4>";
    loadQuestion(); 
    // Because we're setting this up in this function, we need to assign the interval
    // to a global variable. Otherwise, we won't be able to stop it when we need to.

    // If the user has played the game before, show them their high score!
    // Be sure to start the timer when they click on the button to close the high score modal
    var userHighScore=localStorage.getItem("highScore");
    if(userHighScore){
        // Open a modal dialogue to show them their high score
        $('#high-scores').modal();
        document.querySelector("#high-score-body").textContent="Your previous high score was "+userHighScore+". Can you do better this time?";
        
        document.querySelector("#greeting-button").addEventListener("click",function(){
            timerInterval=setInterval(updateTimer,1000);
        });
    }
    // If they didn't set a high score, we can just start the timer right away.
    else timerInterval=setInterval(updateTimer,1000);
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
function myfilter(q){
    return !q.userStatus;
}
// ~~~===---...---===```===---...---===```===---...---===```===---...
// ~~~   loadQuestion()                                           ...
// ~~~   Fills in the question text, removes any previous answers ...
// ~~~   and makes new answer buttons.                            ...
// ~~~   Called by init() and ______                              ...
// ~~~===---...---===```===---...---===```===---...---===```===---...
function loadQuestion(){
    // First, check to see is the user has answered every question, in which case they win
    if(questionArray.length<=0){
        return endGame();
    }
    // Then, check to see if we're out of questions, in which we can replay the questions the user missed
    else if(qPos>questionArray.length-1){
        qPos=0;
        console.log("resetting");
        // And we filter the array down, removing all of the correct answers.
        // Set questionArray to be an array that only contains elements where userStatus
        // is false (!q.userStatus return true for false things)
        questionArray=questionArray.filter(q=>!q.userStatus);
    }    

    
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
        // If we just answered the only question correctly, we are done!
        if(questionArray.length<=1){
            return endGame();
        }
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

    userHighScore=localStorage.getItem("highScore");
    userStoredName=localStorage.getItem("storedName");
    if(userHighScore && finalScore>userHighScore) userHighScore=finalScore;
    localStorage.setItem("highScore",userHighScore);
    
    message.innerHTML+="<div>Please enter your name!</div>";
    message.innerHTML+="<div class='row'><div class='col-8'><form id='user-form' method='POST'></form></div>";

    var userForm=document.querySelector("#user-form");
    var newUserName=document.createElement("input");
    newUserName.type="text";
    newUserName.setAttribute("id","user-name");

    if(userStoredName)
        newUserName.setAttribute("value",userStoredName);

    userForm.appendChild(newUserName);
    var newButton=document.createElement("button");
    newButton.type="submit";
    newButton.textContent="Submit";
    userForm.append(newButton);
    userForm.addEventListener("submit", checkName);


//     var todoForm = document.querySelector("#todo-form");
//     todoForm.addEventListener("submit",addTask); 
}
function checkName(event){
    event.preventDefault();
    var newUserName=document.querySelector("#user-name");
    if(newUserName.value!=""){
        localStorage.setItem("storedName",newUserName.value);
        var userScore=userHighScore;
        var uriString="http://bork.hampshire.edu/~damien/sixbynine/highScore.php?user="+newUserName.value+"&score="+userScore;
        console.log(uriString);
        var highScoreList=new XMLHttpRequest(); 
        highScoreList.onreadystatechange=displayScore;
        highScoreList.open("POST", uriString, true);
         highScoreList.send();
    }
}
// ~~~===---...---===```===---...---===```===---...---===```===---...---===```
// ~~~   displayScore()                                                    ```
// ~~~   Downloads the high scores from all players and displays it here   ```
// ~~~   Called by the endGame()                                           ```
// ~~~===---...---===```===---...---===```===---...---===```===---...---===```

function loadScore(name){


}

// ~~~===---...---===```===---...---===```===---...---===```===---...---===```
// ~~~   displayScore()                                                    ```
// ~~~   Downloads the high scores from all players and displays it here   ```
// ~~~   Called by loadScore()'s XMLHttpRequest                            ```
// ~~~===---...---===```===---...---===```===---...---===```===---...---===```
function displayScore(){
    if (this.readyState == 4 && this.status == 200) {
        allHhighScores = JSON.parse(this.responseText);
       // var userName=document.querySelector("#userName").value;
       // if(userName!=""){
        if(true){
            document.querySelector("#q-num").textContent="High Scores";
            message=document.querySelector("#q-text");
            message.innerHTML="";
            for(score of allHhighScores){
                message.innerHTML+="<div class='row'><div class='col-8'>"+score.user+"</div><div class='col-4'>"+score.score+"</div></div>";
                console.log(score.user+" "+score.score);
            }
        }
    }    
}