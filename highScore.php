<?php
header("Access-Control-Allow-Origin: *");

$mysqli = new mysqli("localhost", "damien", "fhben", "damiendb");
if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}
if(isset($_REQUEST['user'])) $name=$mysqli->real_escape_string($_REQUEST['user']); 
else $name="NULL";
if(isset($_REQUEST['score'])) $score=$_REQUEST['score']; 
else $pass="NULL";

if(!is_null($name) && !is_null($score)){
    $addScorePrep=$mysqli->prepare("INSERT INTO highScore_codeBootcamp (name, score) VALUES (?, ?)");
    if ( false===$addScorePrep)
    die('prepare() failed: ' . htmlspecialchars($mysqli->error));

    $test=$addScorePrep->bind_param("si", $name, $score);           
    if($test===false)
        die('bind() failed: ' . htmlspecialchars($addScorePrep->error));
    //  print "entry bind <br /><br />";
        // var_dump($blogEntryPrep["sqlstate"]);
    
        $test=$addScorePrep->execute();
        if($test===false)
            die('execute() failed: ' . htmlspecialchars($addScorePrep->error));
        //   else echo "Entry Added!";
}
// Having trouble getting the highest scores while keeping the user name distinct. I don't want Poornima flooding the database!
//https://stackoverflow.com/questions/11434124/mysql-select-distinct-by-highest-value
// This is the query they suggest: select max(score) as highest, name from highScore_codeBootcamp group by name order by highest desc;
// Get the full scores list
$getScore="select max(score) as highest, name from highScore_codeBootcamp group by name order by highest desc";
$result = $mysqli->query($getScore);

$scoreArray='[';
// output data of each row
while($row = $result->fetch_assoc()) {
    $scoreArray.='{"user":"'.$row["name"].'","score":"'.$row["highest"].'"},';
}
 $scoreArray=trim($scoreArray,",");
 //$scoreArray.='{"user":"Ben","score":"20"},';
$scoreArray.=']';
echo $scoreArray;
$mysqli->close();



?>