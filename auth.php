<?php
    require('config.php');

    if (!isset($_GET[$dataSecret])) {
        exit('nonono');
    }

    $redirect_url = "http://$_SERVER[HTTP_HOST]$_SERVER[SCRIPT_NAME]?$dataSecret=1";

    if (! isset($_GET['code'])) {
        $auth_url = "moves://app/authorize?client_id=".$clientId."&redirect_uri=".urlencode($redirect_url)."&scope=activity%20location";

        echo "<a href=\"".$auth_url."\">Auth</a>";
    } else {
        $code = $_GET['code'];

        $url = "https://api.moves-app.com/oauth/v1/access_token?grant_type=authorization_code&".
            "code=$code&client_id=$clientId&client_secret=$clientSecret&redirect_uri=".urlencode($redirect_url)."";

        echo $url.'<br>';

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

        echo "<a href=\"$redirect_url\">Again</a>";
    }
?>