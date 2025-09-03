<?php
require 'db.php'; // Make sure this file connects correctly

header('Content-Type: application/json');
$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $price = $_POST['price'] ?? '';
    $description = $_POST['description'] ?? '';
    $category = $_POST['category'] ?? '';

    if ($name && $price && $description && $category) {
        $stmt = $conn->prepare("INSERT INTO products (name, price, description, category) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sdss", $name, $price, $description, $category);

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = "Product added successfully!";
        } else {
            $response['message'] = "Database insert failed: " . $stmt->error;
        }
        $stmt->close();
    } else {
        $response['message'] = "Missing product fields.";
    }
} else {
    $response['message'] = "Invalid request method.";
}

echo json_encode($response);
?>
