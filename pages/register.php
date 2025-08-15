<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $full_name = $_POST['full_name'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    if ($password !== $confirm_password) {
        echo "Passwords do not match.";
        exit;
    }

    // Database connection
    $username = "root";        
    $password = "";            
    $database = "tourism";      
    $port = 4306; 
    $mysqli = new mysqli("localhost", $username, $password, $database, $port);
    
    if ($mysqli->connect_error) {
        die("Connection failed: " . $mysqli->connect_error);
    }

    // Check if email already exists
    $stmt = $mysqli->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        echo "Email already registered.";
    } else {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $mysqli->prepare("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $full_name, $email, $hashed_password);
        $stmt->execute();

        echo "Registration successful!";
        // Redirect to community.html
        header("Location: index.html");
    }

    $stmt->close();
    $mysqli->close();
}
?>
