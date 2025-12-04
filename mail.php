<?php

    // Only process POST reqeusts.
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Get the form fields and remove whitespace.
        $fullname = strip_tags(trim($_POST["fullname"]));
		$fullname = str_replace(array("\r","\n"),array(" "," "),$fullname);
        $phone = strip_tags(trim($_POST["phone"]));
        $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
        $service_type = strip_tags(trim($_POST["service_type"]));
        $message = trim($_POST["message"]);

        // Check that data was sent to the mailer.
        if ( empty($fullname) OR empty($phone) OR empty($message) OR !filter_var($email, FILTER_VALIDATE_EMAIL) OR empty($service_type)) {
            // Set a 400 (bad request) response code and exit.
            http_response_code(400);
            echo "Oops! There was a problem with your submission. Please complete the form and try again.";
            exit;
        }

        // Update this to your desired email address.
        $recipient = "aaraavathishan@gmail.com";
		$subject = "Contact Form: $service_type - Message from $fullname";

        // Email content.
        $email_content = "Name: $fullname\n";
        $email_content .= "Email: $email\n";
        $email_content .= "Phone: $phone\n";
        $email_content .= "Service Type: $service_type\n\n";
        $email_content .= "Message:\n$message\n";

        // Email headers.
        $email_headers = "From: $fullname <$email>\r\nReply-to: <$email>";

        // Send the email.
        if (mail($recipient, $subject, $email_content, $email_headers)) {
            // Set a 200 (okay) response code.
            http_response_code(200);
            echo "Thank You! Your message has been sent.";
        } else {
            // Set a 500 (internal server error) response code.
            http_response_code(500);
            echo "Oops! Something went wrong and we couldn't send your message.";
        }

    } else {
        // Not a POST request, set a 403 (forbidden) response code.
        http_response_code(403);
        echo "There was a problem with your submission, please try again.";
    }

?>
