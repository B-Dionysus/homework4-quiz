<?php
// $returnObj = array("John", "Mary", "Peter", "Sally");
// $returnObj = json_encode($myArr);

echo '[';
echo '{"user":"bob","score":"100"},';
echo'{"user":"alice","score":"75"}';
echo ']';
$returnObj = json_encode($arr);
header("Access-Control-Allow-Origin: *");
?>