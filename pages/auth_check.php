<?php
// auth_check.php
declare(strict_types=1);

// Make sure nothing else is sent
header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: no-store');

ini_set('session.use_strict_mode', '1');
ini_set('session.cookie_httponly', '1');
// If you’ll use HTTPS in prod, enable the next two lines:
// ini_set('session.cookie_secure', '1');
// ini_set('session.cookie_samesite', 'Lax');

// On Render/Railway, ensure session files are writable
// ini_set('session.save_path', '/tmp');

session_start();

echo isset($_SESSION['user_id']) ? 'authenticated' : 'not_authenticated';
exit;
