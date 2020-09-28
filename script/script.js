const maxTime=500;
var timer=maxTime;  // How much time is left before the end of the game?
var qPos=0;     // Which question are we currently asking?
var questionsCorrect=0;
var questionsWrong=0;

var questionArray=[
    {
        "q":"What is one plus three?",
        "options":["One","Two","Apples","Four"],
        "correctAnswerIndex":3,
        "userStatus":0
    },
    {
        "q":"What is one plus one?",
        "options":["One","Two","Three","Four"],
        "correctAnswerIndex":1,
        "userStatus":0
    },
    {
        q:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique nulla inventore praesentium totam iusto, rerum incidunt illum ad ab ducimus dignissimos, fuga fugiat adipisci et mollitia commodi hic accusantium dicta?",
        options:[
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
            "Illum ad ab ducimus dignissimos, fuga fugiat adipisci et mollitia commodi hic accusantium dicta?",
            "Mollitia commodi hic accusantium dicta?",
            "Lorem ipsum dolor sit amet!",
            "Consectetur adipisicing elit. Similique nulla inventore praesentium totam iusto, rerum incidunt illum ad ab ducimus dignissimos, fuga fugiat adipisci et mollitia?"            
        ],
        "correctAnswerIndex":2,
        "userStatus":0
    }
];

// ~~~===---...---===```===---...---===```===---...---===```
// ~~~                  init()                           ```
// ~~~                    Called by <body> .onload();    ```
// ~~~===---...---===```===---...---===```===---...---===```
function init(){
    document.querySelector("#timer").innerHTML="<h4 class='timer'>"+timer+"</h4>";
    loadQuestion(); 
    setInterval(updateTimer,1000);
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
// ~~~   endGame()                                                ...
// ~~~   Displays the final score.                                ...
// ~~~   Called by the updateTimer() and by loadQuestion()        ...
// ~~~===---...---===```===---...---===```===---...---===```===---...
function endGame(){
    if(timer<=0){
        // The user has lost the game!
    }
    else{
        // The user has won the game! 
        // Print the score
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
    if(questionsCorrect==questionArray.length){
        endGame();
    }
    // Then, check to see if we're out of questions, in which we can replay the questions the user missed
    else if(qPos>questionArray.length-1){
        qPos=0;
        console.log("resetting");
    }    
    
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
            var newButton=document.createElement("button");
            newButton.class="button";
            newButton.style.margin="5px";
            newButton.textContent=answer;
            // The index of the correct answer is stored as .correctAnswerIndex, so if the current button number
            // matches this value, we are in the process of creating the correct button
            if(buttonNum===questionArray[qPos].correctAnswerIndex) result=true;
            else result=false;
                                                                                        // // Our button will have a data-result property that tells whether or not it's the correct one
                                                                                        // // The TAs promised that users never ever used the Dev Tool inspector, so I'm not worried about them cheating
                                                                                        newButton.setAttribute("data-result",result);
            answerBox.appendChild(newButton);
           
           // newButton.addEventListener("click",()=>{questionAnswered(result)});       That's not working for some reason
           

            buttonNum++;   
        }
    }
    function questionAnswered(correctly){
        console.log(correctly);
        if(correctly){
            questionsCorrect++;
            questionArray[qPos].userStatus=true;
            document.querySelector("#correct").innerHTML="<h4>Correct: "+questionsCorrect+"</h4>";
        }
        else{
            questionsWrong++;
            document.querySelector("#wrong").innerHTML="<h4>Incorrect: "+questionsWrong+"</h4>";
        }
        qPos++; 
        loadQuestion();
    }
}