<?php
require 'db.php';

$sql = "SELECT sender, message, sent_at FROM messages ORDER BY sent_at DESC LIMIT 20";
$result = $conn->query($sql);

$messages = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }
}

echo json_encode($messages);
?>
