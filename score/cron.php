<?php
include 'db.php';

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

/* check connection */
if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();
}

$query = "DELETE FROM highscore";

if ($mysqli->query($query)) 
    printf("All scores successfully deleted.\n");

/* close connection */
$mysqli->close();
?>