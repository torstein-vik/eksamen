<?php
    session_start();

    $conn = new mysqli("localhost", "root", "","eksamen");
    if ($conn->connect_errno) {
        printf("Connect failed: %s\n", $mysqli->connect_error);
        return;
    }

    $conn -> set_charset("utf8");

    $auth = isset($_SESSION["user"]) && isset($_SESSION["userid"]);



    if (!isset($_GET["type"])){
        return;
    }

    $type = $_GET["type"];

    if ($type == "checklogin"){
        if ($auth){
        ?>
            {
                "status": 1,
                "username": "<?php echo $_SESSION["user"]?>"
            }
        <?php
        } else {
        ?>
            {
                "status": 0
            }
        <?php
        }
        return;
    } else if ($type == "logout"){
        unset($_SESSION["user"]);
        unset($_SESSION["userid"]);
        ?>
            {
                "status": 1
            }
        <?php
        return;
    } else if ($type == "login"){
        $username = $_POST["username"];
        $password = $_POST["password"];

        if(!(isset($username) && $username != "" && isset($password) && $password != "")){
            ?>
            {
                "success": false,
                "message": "Vennligst fyll ut alle feltene"
            }
            <?php
            return;

        }

        $username = $conn->escape_string($username);
        $password = $conn->escape_string($password);

        $username_find = $conn->query("SELECT * FROM users WHERE username = '".$username."'");

        if($username_find->num_rows == 0){
            ?>
            {
                "success": false,
                "message": "Vi finner ikke dette brukernavnet!"
            }
            <?php
            return;
        }

        $user = $username_find->fetch_assoc();

        $salt = bin2hex($user['passsalt']);

        $hash = hash('sha256', $password.$salt);
        if($hash == bin2hex($user["passhash"])){
                $_SESSION['userid'] = $user["userid"];
                $_SESSION['user'] = $username;

                ?>
                {
                    "success": true,
                    "message": "OK"
                }
                <?php
                return;
            } else {
                ?>
                {
                    "success": false,
                    "message": "Feil passord"
                }
                <?php
                return;
            }
        return;

    } else if ($type == "register"){

        foreach(["username", "address", "postnum", "phonenum", "password1", "password2"] as $index){
            if(!(isset($_POST[$index]) && $_POST[$index] != "")){

                ?>
                {
                    "success": false,
                    "message": "Vennligst fyll ut alle feltene"
                }
                <?php
                return;

            } else {
                $$index = $conn->escape_string($_POST[$index]);
            }
        }


        $postnum_ok = $conn->query("SELECT * FROM poststed WHERE postnummer = '$postnum'")->num_rows == 1;

        if(!$postnum_ok){
            ?>
            {
                "success": false,
                "message": "Postnummeret er invalid!"
            }
            <?php
            return;
        }

        if($password1 != $password2){
            ?>
            {
                "success": false,
                "message": "Passordene samsvarer ikke!"
            }
            <?php
            return;
        }

        $username_ok = $conn->query("SELECT * FROM users WHERE username = '$username'")->num_rows == 0;

        if(!$username_ok){
            ?>
            {
                "success": false,
                "message": "Brukernavnet er i bruk fra før!"
            }
            <?php
            return;
        }

        $salt = bin2hex(random_bytes(32));

        $hash = hash('sha256', $password1.$salt);

        $privilege = "'user'";

        $query = $conn->query("INSERT INTO `users`  (username, address, postnummer, telefonnummer, passhash, passsalt, privilege) VALUES ('$username', '$address', '$postnum', '$phonenum',0x$hash,0x$salt,$privilege);");

        if($query){
            $userid = $conn->query("SELECT userid FROM users WHERE username = '".$username."'")->fetch_assoc();

            $_SESSION['userid'] = $userid["userid"];
            $_SESSION['user'] = $username;

            ?>
            {
                "success": true,
                "message": "OK"
            }
            <?php
            return;
        } else {
            ?>
            {
                "success": false,
                "message": "Ukjent feil"
            }
            <?php
            return;
        }

        return;
    } else if ($type == "poststed"){

        if(isset($_POST["postnummer"])){

            $postnummer = $conn->escape_string($_POST["postnummer"]);

            $poststed = $conn->query("SELECT postnummer, poststed FROM poststed WHERE postnummer = '".$postnummer."'");

            if($poststed->num_rows == 1){
                $poststed = $poststed->fetch_assoc()["poststed"];

                ?>
                {
                    "ok": true,
                    "message": "<?php echo $poststed ?>"
                }
                <?php
                return;
            } else {
                ?>
                {
                    "ok": false
                }
                <?php
                return;
            }
        } else {
            ?>
            {
                "ok": false
            }
            <?php
            return;
        }
    } else if ($type == "apartments"){
        $apartments = $conn->query("SELECT * FROM apartments");

        ?>
        {
            "apartments":[
                <?php
                    $is_first_apartment = true;
                    while($apartment = $apartments->fetch_assoc()){
                        if(!$is_first_apartment){
                            echo ",";
                        } else {
                            $is_first_apartment = false;
                        }

                        $images = $conn->query("SELECT apartment_imageid FROM apartment_images WHERE apartmentid='".$apartment["apartmentid"]."'");

                        echo "{";

                        echo '"id": "'.          addslashes($apartment["apartmentid"]).    '",';
                        echo '"number": "'.      addslashes($apartment["apartmentnumber"]).'",';
                        echo '"description": "'. addslashes($apartment["description"]).    '",';
                        echo '"price": "'.       addslashes($apartment["price"]).          '",';
                        echo '"featured_img": "'.addslashes($apartment["featured_img"]).   '",';

                        echo '"images": [';

                        $is_first_image = true;
                        while($image = $images->fetch_assoc()){
                            if(!$is_first_image){
                                echo ",";
                            } else {
                                $is_first_image = false;
                            }

                            echo $image["apartment_imageid"];
                        }

                        echo "]";

                        echo "}";
                    }

                ?>
            ]
        }
        <?php

    } else if ($type == "image"){
        $id = $conn->escape_string($_GET["id"]);

        $data = $conn->query("SELECT * FROM apartment_images WHERE apartment_imageid='$id'");

        if ($data->num_rows != 1){
            echo "Not found!";
            return;
        }

        if (isset($_GET["form"]) && $_GET["form"] == "text"){
            echo $data->fetch_assoc()["imagetext"];
        } else {
            header("Content-type: image");
            include($data->fetch_assoc()["path"]);
        }
    } else if ($type == "reserve") {

        if(!$auth){
            ?>
            {
                "success": false,
                "message": "Vennligst logg inn før du reserverer"
            }
            <?php
            return;
        }

        $userid = $_SESSION["userid"];

        foreach(["date_start", "date_end", "apartmentid"] as $index){
            if(!(isset($_POST[$index]) && $_POST[$index] != "")){

                ?>
                {
                    "success": false,
                    "message": "Vennligst fyll ut alle feltene"
                }
                <?php
                return;

            } else {
                $$index = $conn->escape_string($_POST[$index]);
            }
        }

        if(!($date_start < $date_end)){
            ?>
            {
                "success": false,
                "message": "Startdato må være før sluttdato"
            }
            <?php
            return;
        }

        if($date_start < time()){
            ?>
            {
                "success": false,
                "message": "Startdato må være i framtiden"
            }
            <?php
            return;
        }


        $date_start = date("Y-m-d h:m:s", $date_start);
        $date_end   = date("Y-m-d h:m:s", $date_end);

        if($conn->query("SELECT * FROM reservations WHERE apartmentid = '$apartmentid' AND date_start <= '$date_end' AND date_end >= '$date_start'")->num_rows != 0){
            ?>
            {
                "success": false,
                "message": "Overlapp med en annen reservasjon"
            }
            <?php
            return;
        }

        $insert = $conn->query("INSERT INTO reservations (apartmentid, userid, date_start, date_end) VALUES ('$apartmentid', '$userid', '$date_start', '$date_end')");

        if($insert){
            ?>
            {
                "success": true
            }
            <?php
            return;
        } else {
            ?>
            {
                "success": false,
                "message": "Ukjent feil"
            }
            <?php
            return;
        }
    } else if ($type == "reservations"){
        $id = $conn->escape_string($_GET["id"]);

        $data = $conn->query("SELECT UNIX_TIMESTAMP(date_start), UNIX_TIMESTAMP(date_end) FROM reservations WHERE apartmentid='$id'");

        ?>
        {
            "reservations":[
                <?php
                    $is_first_reservation = true;
                    while($reservation = $data->fetch_assoc()){
                        if(!$is_first_reservation){
                            echo ",";
                        } else {
                            $is_first_reservation = false;
                        }


                        echo "{";

                        echo '"start": "'.$reservation["UNIX_TIMESTAMP(date_start)"].'",';
                        echo '"end": "'.  $reservation["UNIX_TIMESTAMP(date_end)"]  .'"';

                        echo "}";
                    }

                ?>
            ]
        }
        <?php
    } else if ($type == "userreservations"){

        if(!$auth){
            ?>
            {
                "success": false
            }
            <?php
            return;
        }

        $reservation_data = $conn->query("SELECT *, UNIX_TIMESTAMP(date_start), UNIX_TIMESTAMP(date_end) FROM reservations, apartments WHERE reservations.apartmentid = apartments.apartmentid AND userid='".$_SESSION["userid"]."'");

        $user_data = $conn->query("SELECT * FROM users, poststed WHERE poststed.postnummer = users.postnummer AND userid='".$_SESSION["userid"]."'")->fetch_assoc();


        ?>
        {
            "success": true,
            "userdata": {
                <?php
                echo '"phone": "'.addslashes($user_data["telefonnummer"]).'",';
                echo '"address": "'.addslashes($user_data["address"]." ".$user_data["postnummer"]." ".$user_data["poststed"]).'"';
                ?>
            },
            "reservations":[
                <?php
                    $is_first_reservation = true;
                    while($reservation = $reservation_data->fetch_assoc()){
                        if(!$is_first_reservation){
                            echo ",";
                        } else {
                            $is_first_reservation = false;
                        }


                        echo "{";

                        echo '"reservationid": "'.  $reservation["reservationid"]             .'",';
                        echo '"apartmentid": "'.    $reservation["apartmentid"]               .'",';
                        echo '"start": "'.          $reservation["UNIX_TIMESTAMP(date_start)"].'",';
                        echo '"end": "'.            $reservation["UNIX_TIMESTAMP(date_end)"]  .'",';
                        echo '"apartmentnumber": "'.$reservation["apartmentnumber"]           .'",';
                        echo '"price": "'.          $reservation["price"]                     .'"';

                        echo "}";
                    }

                ?>
            ]
        }
        <?php
    } else if ($type == "deletereservation"){

        if(!$auth){
            ?>
            {
                "success": false,
                "message": "Du må logge inn for å kunne kansellere"
            }
            <?php
        }

        $userid = $_SESSION["userid"];

        foreach(["reservationid"] as $index){
            if(!(isset($_POST[$index]) && $_POST[$index] != "")){

                ?>
                {
                    "success": false,
                    "message": "Vennligst fyll ut alle feltene"
                }
                <?php
                return;

            } else {
                $$index = $conn->escape_string($_POST[$index]);
            }
        }

        $auth_ok = $conn->query("SELECT * FROM reservations WHERE reservationid='$reservationid' AND userid='$userid'")->num_rows == 1;

        if(!$auth_ok){
            ?>
            {
                "success": false,
                "message": "Du er ikke autorisert!"
            }
            <?php
        }

        $delete = $conn->query("DELETE FROM reservations WHERE reservationid='$reservationid' AND userid='$userid'");

        if($delete){
            ?>
            {
                "success": true
            }
            <?php
        } else {
            ?>
            {
                "success": false,
                "message": "Ukjent feil"
            }
            <?php
        }

    }


    $conn->close();
?>
