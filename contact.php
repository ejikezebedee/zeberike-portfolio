<?php
// Contact form handler for Hostinger hPanel (PHP shared hosting).
// Emails the submission and returns JSON for the front-end.

header('Content-Type: application/json');

// Recipient: Emeka's mailbox. From must be a real mailbox on the account.
$to = 'emekekorie@zeberike.com';
$from_email = 'emekekorie@zeberike.com';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$company = trim($_POST['company'] ?? '');
$type    = trim($_POST['type'] ?? '');
$budget  = trim($_POST['budget'] ?? '');
$message = trim($_POST['message'] ?? '');
$website = trim($_POST['website'] ?? ''); // honeypot field

// Honeypot: bots fill the hidden field. Pretend success, drop silently.
if ($website !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

if ($name === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

$subject = 'New project inquiry from ' . $name;

$body = "Name: {$name}\n"
      . "Email: {$email}\n"
      . "Company: " . ($company !== '' ? $company : '-') . "\n"
      . "Project type: " . ($type !== '' ? $type : '-') . "\n"
      . "Budget: " . ($budget !== '' ? $budget : '-') . "\n"
      . "\nMessage:\n{$message}\n";

$headers = "From: Zeberike Contact <{$from_email}>\r\n"
         . "Reply-To: {$email}\r\n"
         . "X-Mailer: PHP/" . phpversion();

$ok = @mail($to, $subject, $body, $headers);

if ($ok) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email']);
}
