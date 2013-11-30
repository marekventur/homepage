<?php
    require('config.php');

    $tokenFile = json_decode(file_get_contents('token.json'));
    $token = $tokenFile->access_token;

    // Check current token
    $url = "https://api.moves-app.com/oauth/v1/tokeninfo?access_token=".$token;
    $validity = json_decode(file_get_contents($url));
    var_dump($validity);

    // Refresh token if it would expire in two weeks
    if ($validity->expires_in < 2 * 7 * 24 * 60 * 60) {
        $refreshToken = $tokenFile->refresh_token;
        $url = "https://api.moves-app.com/oauth/v1/access_token?grant_type=refresh_token&".
            "refresh_token=$refreshToken&client_id=$clientId&client_secret=$clientSecret";
        $options = array(
            'http' => array(
                'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                'method'  => 'POST',
                'content' => ''
            ),
        );
        $context  = stream_context_create($options);
        $result = file_get_contents($url, false, $context);
        file_put_contents('token.json', $result);

        echo "Token has been refreshed";
    } else {
        echo "Token was ok";
    }