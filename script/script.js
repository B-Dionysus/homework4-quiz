const maxTime=500;
var timer=maxTime;  // How much time is left before the end of the game?
var qPos=0;     // Which question are we currently asking?

var questionArray=[
    {
        "q":"What is one plus three?",
        "options":["One","Two","Apples","Four"],
        "a":3,
        "userStatus":0
    },
    {
        "q":"What is one plus one?",
        "options":["One","Two","Three","Four"],
        "a":3,
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
        a:2,
        "userStatus":0
    }
];

// ~~~===---...---===```===---...---===```===---...---===```
// ~~~                  init()                           ```
// ~~~                    Called by <body> .onload();    ```
// ~~~===---...---===```===---...---===```===---...---===```
function init(){
    document.querySelector("#timer").innerHTML="<h4 class='timer'>"+timer+"</h4>";
    loadQuestion();       // qPos is incremented at the start of loadQuestion() (so that we can easily call it from a button) so we should start at -1;
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
function loadQuestion(position){
    // This gets called mainly from the answer button, so the first thing to do is to increment qPos.
    qPos++;
    // First, check to see if we're out of questions, in which case the user has won!
    if(qPos>=questionArray.length-1){
        endGame();
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
            newButton=document.createElement("button");
            newButton.class="button";
            newButton.style.margin="5px";
            newButton.textContent=answer;
            answerBox.appendChild(newButton);
            // Is this button the right answer!
            if(buttonNum===questionArray[qPos].a){
                newButton.addEventListener("click",loadQuestion);
            }
            buttonNum++;   
        }
    }
}