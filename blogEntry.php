<html>
<head>
<title> 'Blog Entry</title>
<?PHP
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$mysqli = new mysqli("localhost", "damien", "fhben", "damiendb");
if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}





if(isset($_REQUEST['name'])) $name=$mysqli->real_escape_string($_REQUEST['name']); 
else $name="NULL";

if(isset($_REQUEST['password'])) $pass=$_REQUEST['password']; 
else $pass="NULL";

if(isset($_REQUEST['cmd'])) $cmd=$_REQUEST['cmd']; 
else $cmd="NULL";

$date=date("Y-m-d"); 

if(isset($_REQUEST['date'])){
  if($_REQUEST['date']!="") $date=$_REQUEST['date'];
} 

if(isset($_REQUEST['title'])) $title=$mysqli->real_escape_string($_REQUEST['title']); 
else $title="NULL";

if(isset($_REQUEST['text'])){ $text=$mysqli->real_escape_string($_REQUEST['text']); print $text;}
else $text="Enter a Text right here, if you like!";

if(isset($_REQUEST['keywords'])) $keywords=$mysqli->real_escape_string($_REQUEST['keywords']); 
else $keywords="";

$ip=$_SERVER['REMOTE_ADDR'];

if(isset($_REQUEST['keywords']) && $_REQUEST['keywords']!=""){
  $tagArray=explode(", ",$mysqli->real_escape_string($_REQUEST['keywords']));  
}
if(isset($_REQUEST['cat'])) $cat=$mysqli->real_escape_string($_REQUEST['cat']);  



$sql="SELECT * FROM blog where type='password' and author=\"".$name."\"";
$res = $mysqli->query($sql);
$data = $res->fetch_assoc();  
 ini_set('display_errors', 1); 
if(isset($data['entry']) && $data['entry']==$pass)
{

  if($cmd=="new")
  {
    if(!isThisADupe($text, $date, $mysqli)){
    
      $blogEntryPrep=$mysqli->prepare("INSERT INTO blog (author, entry, date, type, title, IP, keywords) VALUES (?, ?, ?, ?, ?, ?, ?)");
      if ( false===$blogEntryPrep)
          die('prepare() failed: ' . htmlspecialchars($mysqli->error));

      $test=$blogEntryPrep->bind_param("sssssss", $name, $text, $date, $cat, $title, $ip, $keywords);           
      if($test===false)
        die('bind() failed: ' . htmlspecialchars($blogEntryPrep->error));
        print "entry bind <br /><br />";
         // var_dump($blogEntryPrep["sqlstate"]);
          
      $test=$blogEntryPrep->execute();
      if($test===false)
        die('execute() failed: ' . htmlspecialchars($blogEntryPrep->error));
      else echo "Entry Added!";
      
      
      
      
      if(isset($tagArray) && $tagArray!=""){
      //  $kwEntryPrep=$mysqli->prepare("UPDATE TABLE blogkeywords set freq=? where keyword=?");
      //  $kwCountPrep=$mysqli->prepare("SELECT COUNT(?) FROM blog where keywords like '%trial%'");
      //   if($kwCountPrep===false)
      //    die('prepare() failed: ' . htmlspecialchars($kwCountPrep->error));
        
//        $incFreq=$mysqli->prepare("update table blogkeywords set freq= ? where keyword= ?");

        foreach($tagArray as $tag){
          $t="%".$tag."%";
//          $t="%trial%";
//          $t="keywords";
 //         print $t;
        //  $test=$kwCountPrep->bind_param("s", $t);           
        // if($test===false)
        //  die('bind() failed: ' . htmlspecialchars($kwCountPrep->error));
        //  print "KW Bind<br /><br />";
        //  var_dump($kwCountPrep);
          
       //  $test=$kwCountPrep->execute();
        // if($test===false)
         // die('execute() failed: ' . htmlspecialchars($kwCountPrep->error));
          
        //  $count=$kwCountPrep->num_rows;
        $ksql="SELECT COUNT(keywords) FROM blog where keywords like '".$tag."'";
        $res=$mysqli->query($ksql);
        $count=$res->num_rows;
          print "caws=".$count;
          if($count>0){
            $count++;
//            $t=change all % to # in $t;
//            $incFrew->bind_param("is", $count, $t);
                                      }
                                      else $q='insert into blogkeywords values("", "'.$tag.'", 1)';
                                   // print $q;
  
        }
      } 
      $blogEntryPrep->close();  
    }
    else print ("You just entered this one!");
}

}
?>
<br /><br />
<link rel="stylesheet" href="./widgEditor/css/widgEditor.css" />
<script src="./widgEditor/scripts/widgEditor.js"></script>
</head>
<body>
<form action="./blogEntry.php" method="GET">
<b>Title: </b><input name="title" type="input" 
<?PHP
  if(isset($_REQUEST['title'])) print ' value="'.$_REQUEST['title'].'" ';
?>
/><br />
<textarea name="text" CLASS="widgEditor"><?PHP if(isset($_REQUEST['text'])) print $text; else print "Here. This is for your text.";?></textarea><br />
Date: <input type="date" name="date"  value="<?PHP print $date; ?>"/>

keywords: <input name="keywords" id="keywords" type="text" 
<?PHP
  if(isset($_REQUEST['keywords'])) print ' value="'.$_REQUEST['keywords'].'" ';
?>
/><br />


Category: <select name="cat" id="cat">
<option value="resume">Resume</option>
<?PHP
  $res = $mysqli->query("SELECT DISTINCT type FROM blog order by type");
  while($row = $res->fetch_assoc()){
    echo "<option value=\"".$row['type']."\">".$row['type']."</option>". "\n";
  }
?>
</select>   <br /><br />


User: <input type="text" name="name"/ <?PHP if(isset($_REQUEST['name'])) print $_REQUEST['name'];?>>

Password:<input name="password" type="password" length="40" <?PHP if(isset($_REQUEST['password'])) print $_REQUEST['password'];?>/>

<br /> 
<input type="hidden" name="cmd" value="new" />
<input type="submit" />
</form>

</body>
</html>



<?PHP
function isThisADupe($txt, $d, $m){
  $q='select entry from blog where date='.$d;
  $res = $m->query($q);
  while($data = $res->fetch_assoc()){
    if($data['entry']==$txt) return 1;
  }
  return 0;
}
function connect()
{
	$servername = "localhost";
	$username = "damien";
	$password = "fhben";
	$db="damiendb";

	// Create connection
	$l = new mysqli($servername, $username, $password, $db);

	// Check connection
	if ($link->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}
	//echo "Connected successfully";
	return $l;
}
function customError($errno, $errstr, $errline) {
  
	if($errno!=E_USER_WARNING && $errno!=8){
		print "<b>Error:</b> [$errno] $errstr<br>";
		print "Ending Script";
//		die();
	}
} 
?>