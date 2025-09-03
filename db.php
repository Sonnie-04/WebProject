<?php
$servername = "localhost";
$username = "root"; // default username for XAMPP
$password = ""; // default password is empty
$dbname = "fine_organic";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>