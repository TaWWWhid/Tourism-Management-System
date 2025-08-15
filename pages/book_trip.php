
<?php

$username = "root";        
$password = "";            
$database = "tourism";      
$port = 4306; 
$mysqli = new mysqli("localhost", $username, $password, $database, $port);

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $full_name = $_POST['full_name'];
    $contact_phone = $_POST['contact_phone'];
    $contact_email = $_POST['contact_email'];
    $participants = $_POST['participants'];
    $destination = $_POST['destination'];
    $trip_duration = $_POST['trip_duration'];
    $hotel_choice = $_POST['hotel_choice'];
    $payment_method = $_POST['payment_method'];

    $stmt = $mysqli->prepare("INSERT INTO bookings (full_name, contact_phone, contact_email, participants, destination, trip_duration, hotel_choice, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssss", $full_name, $contact_phone, $contact_email, $participants, $destination, $trip_duration, $hotel_choice, $payment_method);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Booking successful!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Booking failed!']);
    }

    $stmt->close();
}

$mysqli->close();
?>

