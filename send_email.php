<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $name = $_POST["name"];
  $email = $_POST["email"];
  $topic = $_POST["topic"];
  $message = $_POST["message"];
  $to = "mathijslehman.ml@gmail.com";
  $subject = "New Contact Form Submission - " . $topic;
  $headers = "From: " . $name . " <" . $email . ">\r\n";
  
  if (mail($to, $subject, $message, $headers)) {
    echo json_encode(array("status" => "success", "message" => "Email sent successfully!"));
  } else {
    echo json_encode(array("status" => "error", "message" => "Failed to send email. Please try again later."));
  }
}
?>