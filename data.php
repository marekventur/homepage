<?php
    require('config.php');

    $tokenFile = json_decode(file_get_contents('token.json'));
    $token = $tokenFile->access_token;

    $url = "https://api.moves-app.com/api/v1/user/places/daily?pastDays=2&access_token=$token";
    $data = json_decode(file_get_contents($url));

    
    $currentDay = array_pop($data);
    if ($currentDay->segments == null || count($currentDay->segments) == 0) {
        $currentDay = array_pop($data);
    }
    $currentPos = array_pop($currentDay->segments);
    
    header('Content-Type: application/json');
    echo json_encode($currentPos);