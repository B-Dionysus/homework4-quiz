<?php
// I learned so many exciting things about COR restrictions!
// I still have idea how a solution as simple as adding the following
// line of code will grant my script access, while still defeating the
// bad guys, but it works!
header("Access-Control-Allow-Origin: *");

// First we set up a connection to the database. I am hoping that I remember to scrub my
// password from the public version of this file! The real php code lives privately on my
// server, safe from prying eyes.
$mysqli = new mysqli("localhost", "#######", "#######", "########");
if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}


// Next we check to see if we are receiving a username and a score. If we are, I hope to heck
// that real_escape_string() will prevent any nefarious hax0rs from exploiting my database.
// My code is the one that sent score, so we can trust that it is just a number
// (We definitely cannot trust this--anyone can navigate to the same URL and input anything they
// want in here. But hopefully mysqli->prepare() will save me, in that case, because it will insist on
// getting a number. It's still quite possible to cheat this way, though, and put yourself on the scoreboard 
// with a ridulously high score!)
if(isset($_REQUEST['user'])) $name=$mysqli->real_escape_string($_REQUEST['user']); 
else $name="NULL";
if(isset($_REQUEST['score'])) $score=$_REQUEST['score']; 
else $pass="NULL";


// We prepare, by telling mysql what to expect
if(!is_null($name) && !is_null($score)){
    $addScorePrep=$mysqli->prepare("INSERT INTO highScore_codeBootcamp (name, score) VALUES (?, ?)");
    if ( false===$addScorePrep)
    die('prepare() failed: ' . htmlspecialchars($mysqli->error));


    // And we insist on a string and a number here. This prints the error if the
    // bind fails, which is useful in testing / development. In the real world, of course,
    // there's no way for anyone to see this error and so it just fails to add anything to the database
    $test=$addScorePrep->bind_param("si", $name, $score);           
    if($test===false)
        die('bind() failed: ' . htmlspecialchars($addScorePrep->error));
    
        $test=$addScorePrep->execute();
        if($test===false)
            die('execute() failed: ' . htmlspecialchars($addScorePrep->error));
}
// Having trouble getting the highest scores while keeping the user name distinct. I don't want Poornima flooding the database!
//https://stackoverflow.com/questions/11434124/mysql-select-distinct-by-highest-value
// This is the query they suggest: select max(score) as highest, name from highScore_codeBootcamp group by name order by highest desc;
// Get the full scores list
$getScore="select max(score) as highest, name from highScore_codeBootcamp group by name order by highest desc";
$result = $mysqli->query($getScore);

// And here we create the JSON to return to our script.
$scoreArray='[';
// output data of each row
while($row = $result->fetch_assoc()) {
    $scoreArray.='{"user":"'.$row["name"].'","score":"'.$row["highest"].'"},';
}
 $scoreArray=trim($scoreArray,",");
$scoreArray.=']';
echo $scoreArray;
$mysqli->close();
?>