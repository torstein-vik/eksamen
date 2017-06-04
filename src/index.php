<html>
    <head>
        <title>Eksamen</title>
        <meta charset="utf-8" />

        <meta name="description" content="Beskrivelse">
        <meta name="keywords" content="stikkord,stikkord">
        <meta name="author" content="Torstein Vik">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <script src="lib/jquery-3.2.1.min.js"></script>

        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Oxygen"    rel="stylesheet" type="text/css">

        <link rel="stylesheet" href="index.css"/>
        <link rel="icon" href="res/logo_small.ico"/>



        <script src="json/gallery.json"> </script>
        <script src="index.js"> </script>

        <script>
        var url = "<?php echo (isset($_GET["page"]) ? $_GET["page"] : "");?>";
        </script>

    </head>
    <body style="display: none;">
        <div id="header">


            <h1 class="title" id="title"> Eksamen </h1>
            <div id="usernav">
            </div>

            <div class="selection" id="subject" group="subject">
                <div for="home">Hjem</div>
                <div for="products">Side 1</div>
                <div for="finish">Side 2</div>
            </div>
        </div>
        <div id="global" class="selection-scroller">


            <div id="content" >
                <div id="home" for="subject" class="selectionelement">

                    <img id="slide">
                    <div id="slide_text"></div><p><br>

                    Tekst

                </div>
                <div id="products" for="subject" class="selectionelement">



                </div>
                <div id="finish" for="subject" class="selectionelement">



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
            <input type="password" id="password1" placeholder="Passord" required>
            <input type="password" id="password2" placeholder="Bekreft passord" required>
            <input type="submit" id="name" value="Registrer deg!">
        </form>

    </modal>
</html>
