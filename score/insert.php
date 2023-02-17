<?php
include 'db.php';

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

if ( $result = $mysqli->query("SELECT score FROM highscore WHERE name='".$_GET["name"]."' ORDER BY score DESC") ) {        
    if($result->num_rows){
        $row=$result->fetch_row();        
        if ($row[0]<$_GET["score"]) 
            $mysqli->query("UPDATE highscore SET score=".$_GET["score"].", wallet='".$_GET["wallet"]."' WHERE name='".$_GET["name"]."'");
    }
    else
        $mysqli->query("INSERT INTO highscore VALUES (0,'".$_GET["name"]."',".$_GET["score"].",'".$_GET["wallet"]."')");
    $result->close();     
}

/* close connection */
$mysqli->close();
?>