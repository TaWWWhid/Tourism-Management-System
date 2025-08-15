
<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['login_email'];
    $password = $_POST['login_password'];


    // Database connection
    $username = "root";        
    $password = "";            
    $database = "tourism";      
    $port = 4306; 
    $mysqli = new mysqli("localhost", $username, $password, $database, $port);

    if ($mysqli->connect_error) {
        die("Connection failed: " . $mysqli->connect_error);
    }

    $stmt = $mysqli->prepare("SELECT id, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $hashed_password);
        $stmt->fetch();

        if (password_verify($password, $hashed_password)) {
            // Successful login
            $_SESSION['user_id'] = $id;
            echo "Login successful!";
            // Redirect to community.html
            header("Location: index.html");
        } else {
            echo "Invalid password.";
        }
    } else {
        echo "No user found with this email.";
    }

    $stmt->close();
    $mysqli->close();
}
?>
