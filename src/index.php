<html>
    <head>
        <title>Volsdalspause</title>
        <meta charset="utf-8" />

        <meta name="description" content="Ta en pause fra bymaset i våre koslige rimlige leiligheter!">
        <meta name="keywords" content="ferie, rolig, pause, volsdalen, volsdal, volsdalspause, reserver, reservasjon">
        <meta name="author" content="Torstein Vik">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <script src="lib/jquery-3.2.1.min.js"></script>

        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Oxygen"    rel="stylesheet" type="text/css">

        <link rel="stylesheet" href="style"/>
        <link rel="icon" href="res/logo.ico"/>



        <script src="json/gallery.json"> </script>
        <script src="index.js"> </script>

        <script>
        var url = "<?php echo (isset($_GET["page"]) ? $_GET["page"] : "");?>";
        </script>

    </head>
    <body style="display: none;">
        <div id="header">

            <img src="res/logo.svg">

            <h1 class="title" id="title"> Volsdalspause </h1>
            <div id="usernav">
            </div>

            <div class="selection" id="subject" group="subject">
                <div for="home">Hjem</div>
                <div for="reserve">Reservér</div>
                <div for="reservations">Mine reservasjoner</div>
            </div>
        </div>
        <div id="global" class="selection-scroller">


            <div id="content" >
                <div id="home" for="subject" class="selectionelement">

                    <img id="slide">
                    <div id="slide_text"></div><p><br>

                    Trenger du en pause fra det hektiske bylivet? Her hos volsdalspause kan du få deg en slik pause - i Volsdalen! Registrer deg, og reserver alle de periodene du vil! Vi kontakter deg etterpå for å få bekreftet bestillingen.

                </div>
                <div id="reserve" for="subject" class="selectionelement">

                    <p style='margin-bottom:20px; text-align:center'>Du må registrere deg eller logge inn for å kunne reserve.</p>

                    <div class="selection" id="apartments" group="apartments">

                    </div>

                </div>
                <div id="reservations" for="subject" class="selectionelement">



                </div>

                <div id="404page" for="subject" class="selectionelement">
                    <h2 style="text-align: center;">404! Vi fant ikke siden du ba om!</h2>
                </div>
            </div>
        </div>


    </body>
    <modal id="login-modal" title="Logg inn">
        <form id="login">
            <input type="text" id="username" placeholder="Brukernavn" required>
            <input type="password" id="password" placeholder="Passord" required>
            <input type="submit" id="name" value="Logg inn!">
        </form>

    </modal>
    <modal id="register-modal" title="Registrer deg">
        <form id="register">
            <input type="text" id="username" placeholder="Brukernavn" required>
            <input type="text" id="address" placeholder="Adresse" required>
            <input type="text" id="postnum" placeholder="Postnummer" oninput="fetchPoststed(this.value, (s) => $('#poststed').html(s))" required>
            <div id="poststed"> Postnummeret er invalid</div>
            <input type="text" id="phonenum" placeholder="Telefonnummer" required>
            <input type="password" id="password1" placeholder="Passord" required>
            <input type="password" id="password2" placeholder="Bekreft passord" required>
            <input type="submit" id="name" value="Registrer deg!">
        </form>

    </modal>
</html>
