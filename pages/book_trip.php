<?php
// Always return JSON
header('Content-Type: application/json; charset=utf-8');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Turn mysqli errors into exceptions so we can catch and return neat JSON
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    // 1) Read input
    $full_name      = trim($_POST['full_name']        ?? '');
    $contact_phone  = trim($_POST['contact_phone']    ?? '');
    $contact_email  = trim($_POST['contact_email']    ?? '');
    $participants   = trim($_POST['participants']     ?? '');
    $destination    = trim($_POST['destination']      ?? '');
    $trip_duration  = trim($_POST['trip_duration']    ?? '');
    $hotel_choice   = trim($_POST['hotel_choice']     ?? '');
    $payment_method = trim($_POST['payment_method']   ?? '');

    // Basic validation
    if ($full_name === '' || $contact_phone === '' || $contact_email === '' || $participants === '' || $destination === '') {
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
        exit;
    }

    // 2) Database connection
    // Use environment variables in production. Fallback to local XAMPP.
    $db_host = getenv('DB_HOST') ?: '127.0.0.1';
    $db_port = getenv('DB_PORT') ?: '3306';            // XAMPP default is 3306
    $db_name = getenv('DB_NAME') ?: 'tourism';
    $db_user = getenv('DB_USER') ?: 'root';
    $db_pass = getenv('DB_PASS') ?: '';

    $mysqli = new mysqli($db_host, $db_user, $db_pass, $db_name, (int)$db_port);
    $mysqli->set_charset('utf8mb4');

    // 3) Insert booking
    $sql = "INSERT INTO bookings
            (full_name, contact_phone, contact_email, participants, destination, trip_duration, hotel_choice, payment_method)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param(
        "ssssssss",
        $full_name, $contact_phone, $contact_email, $participants,
        $destination, $trip_duration, $hotel_choice, $payment_method
    );
    $stmt->execute();
    $stmt->close();
    $mysqli->close();

    // 4) Success JSON
    echo json_encode([
        'status'  => 'success',
        'message' => 'Booking successful!'
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    // Log server-side if you want: error_log($e);
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Server error while saving booking'
    ]);
}
