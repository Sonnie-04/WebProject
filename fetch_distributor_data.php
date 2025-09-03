<?php
include 'db.php';

// Fetch farmer network
$farmers = [];
$sql1 = "SELECT * FROM farmer_network";
$result1 = $conn->query($sql1);
if ($result1 && $result1->num_rows > 0) {
    while ($row = $result1->fetch_assoc()) {
        $farmers[] = $row;
    }
}

// Fetch shipments
$shipments = [];
$sql2 = "SELECT * FROM product_shipments";
$result2 = $conn->query($sql2);
if ($result2 && $result2->num_rows > 0) {
    while ($row = $result2->fetch_assoc()) {
        $shipments[] = $row;
    }
}

// Return as JSON
echo json_encode([
    'farmers' => $farmers,
    'shipments' => $shipments
]);
?>
