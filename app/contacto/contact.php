<?php
require 'PHPMailerAutoload.php';
$data = file_get_contents("php://input");

$decoded = json_decode($data);

sendMail($decoded->email, $decoded->nombre, $decoded->mensaje, $decoded->asunto);

function sendMail($email, $nombre, $mensaje, $asunto){





    $mail = new PHPMailer;
    $mail->isSMTP();                                      // Set mailer to use SMTP
    $mail->Host = 'gator4184.hostgator.com';  // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;                               // Enable SMTP authentication
    $mail->Username = 'ventas@ac-desarrollos.com';                 // SMTP username
    $mail->Password = 'ventas';                           // SMTP password
    $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 465;

    $mail->From = $email;
    $mail->FromName = $nombre;
    $mail->addAddress('arielcessario@gmail.com');     // Add a recipient
    $mail->addAddress('juan.dilello@gmail.com');               // Name is optional
    $mail->addAddress('diegoyankelevich@gmail.com');               // Name is optional
//    $mail->addReplyTo('info@example.com', 'Information');
//    $mail->addCC('cc@example.com');
//    $mail->addBCC('bcc@example.com');

//    $mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
//    $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
//    $mail->isHTML(true);                                  // Set email format to HTML

    $mail->Subject = $asunto;
    $mail->Body    = $mensaje;
    $mail->AltBody = $mensaje;

    if(!$mail->send()) {
        echo 'Message could not be sent.';
        echo 'Mailer Error: ' . $mail->ErrorInfo;
    } else {
        echo 'Message has been sent';
    }





//    // message lines should not exceed 70 characters (PHP rule), so wrap it
//    $mensaje = wordwrap("Mensaje de ". $nombre . "\n Cuerpo del mensaje: " . $mensaje, 100);
//    // send mail
//    mail("arielcessario@gmail.com", $asunto, $mensaje, "From: $email\n");
//    mail("juan.dilello@gmail.com", $asunto, $mensaje, "From: $email\n");
//    mail("diegoyankelevich@gmail.com", $asunto, $mensaje, "From: $email\n");
//    echo ($email . $nombre . $mensaje . $asunto);
}

