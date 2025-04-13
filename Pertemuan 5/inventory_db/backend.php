<?php
// backend.php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "inventory_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action === 'getItems') {
    $result = $conn->query("SELECT * FROM items");
    $items = [];
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
    echo json_encode($items);
} elseif ($action === 'searchItem') {
    $name = $_GET['name'];
    $stmt = $conn->prepare("SELECT * FROM items WHERE item_name = ?");
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $result = $stmt->get_result();
    $items = [];
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
    echo json_encode($items);
} elseif ($action === 'addItem') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("INSERT INTO items (item_name, item_cost, description, quantity, available) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sissi", $data['item_name'], $data['item_cost'], $data['description'], $data['quantity'], $data['available']);
    $success = $stmt->execute();
    echo json_encode(['success' => $success]);
} elseif ($action === 'updateItem') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("UPDATE items SET item_name = ?, item_cost = ?, description = ?, quantity = ?, available = ? WHERE id = ?");
    $stmt->bind_param("sissii", $data['item_name'], $data['item_cost'], $data['description'], $data['quantity'], $data['available'], $data['id']);
    $success = $stmt->execute();
    echo json_encode(['success' => $success]);
} elseif ($action === 'deleteItem') {
    $id = $_GET['id'];
    $stmt = $conn->prepare("DELETE FROM items WHERE id = ?");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    echo json_encode(['success' => $success]);
} elseif ($action === 'issueItem') {
    $id = $_GET['id'];
    $stmt = $conn->prepare("UPDATE items SET available = available - 1 WHERE id = ? AND available > 0");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    echo json_encode(['success' => $success]);
}

$conn->close();
?>