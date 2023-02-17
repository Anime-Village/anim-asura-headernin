<?php
include 'db.php';

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

/* check connection */
if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();
}

$query = "SELECT name, score, wallet FROM highscore ORDER by score DESC";

if ($result = $mysqli->query($query)) {

    /* fetch associative array */
    $i=0;    
    while ($row = $result->fetch_assoc()) {    	
    	$top3=$i<3?"top3":"";
        printf ("<tr class='%s'><td class='num'>%s</td><td class='name'>%s</td><td class='score'>%s</td><td class='wallet'><a target='_blank' href='https://etherscan.io/address/%s'></a></td></tr>", 
        	$top3, $i+1, $row["name"], $row["score"], $row["wallet"]);
        $i++;
    }
    if($i<6){
    	while($i<6){
    		printf ("<tr><td class='num'></td><td class='name'></td><td class='score'></td><td class='wallet'></td></tr>");
    		$i++;
    	}
    }
    /* free result set */
    $result->free();
}

/* close connection */
$mysqli->close();
?>