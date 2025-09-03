<?php
include 'db.php';

$sql = "SELECT * FROM retailer_products";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html>
<head>
  <title>Retailer Product Listings</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
    }
    h2 {
      color: #2c3e50;
    }
    table {
      width: 90%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #aaa;
      padding: 10px;
      text-align: center;
    }
    th {
      background-color: #f2f2f2;
    }
    .btn-back {
      display: inline-block;
      background-color: #28a745;
      color: white;
      padding: 10px 16px;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
    }
  </style>
</head>
<body>

  <h2>Retailer Product Listings</h2>

  <?php if ($result->num_rows > 0): ?>
    <table>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Stock Quantity</th>
        <th>Price (Ksh)</th>
        <th>Last Updated</th>
      </tr>
      <?php while($row = $result->fetch_assoc()): ?>
        <tr>
          <td><?= htmlspecialchars($row["id"]) ?></td>
          <td><?= htmlspecialchars($row["name"]) ?></td>
          <td><?= htmlspecialchars($row["stock_quantity"]) ?> Kg</td>
          <td><?= htmlspecialchars($row["price"]) ?></td>
          <td><?= htmlspecialchars($row["updated_at"]) ?></td>
        </tr>
      <?php endwhile; ?>
    </table>
  <?php else: ?>
    <p>No products found in retailer listings.</p>
  <?php endif; ?>

   <button onclick="window.location.href='index.html'" class="btn-back">Back to Dashboard</button>
</body>
</html>

<?php $conn->close(); ?>
