<?php
session_start();
include 'db.php';

$response = array('success' => false, 'message' => '');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $farm_name = $_POST['farm_name'];
    $location = $_POST['location'];
    $contact = $_POST['contact'];
    $email = $_POST['email'];

    $sql = "INSERT INTO farmers (farm_name, location, contact, email) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $farm_name, $location, $contact, $email);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = "Farmer registered successfully!";
    } else {
        $response['message'] = "Error: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>