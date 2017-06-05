
// init-function
$(function(){

    // Load all the products into the DOM and hide all tabs
    load().done(() => {
        // Hide all tabs
        $(".selectionelement").hide();

        // Initialises the system responsible for tabs
        initSelectionSystem();

        initModalSystem();

        // Load the specified URL
        loadURL(url);


        // Show the previously hidden body (this is to prevent ugly loading)
        $("body").show();
    });


    // Start the slideshow
    startSlideshow();

});

function load(){
    return $.when(loadLogin());
}

function loadLogin(){
    var def = new $.Deferred();

    $.ajax({
        url: "api?type=checklogin"
    }).done((json) => {
        var result = JSON.parse(json);

        if (result.status == 1){
            $("#usernav").html(`
                <div>Velkommen, ${result.username}</div>
                <div id="logoutbutton"> Logg ut </div>
            `);

            $("#usernav #logoutbutton").click(() => {
                if(window.confirm("Er du sikker på at du vil logge ut?")){
                    $.ajax({
                        url: "api?type=logout"
                    }).done((json) => {
                        var result = JSON.parse(json);

                        if(result.status == 1){

                            loadLogin();
                        } else {
                            alert("Error when logging out. Please try again");
                        }
                    });
                }
            });


        } else {
            $("#usernav").html(`
                <div id="loginbutton" class="modalbutton" for="login-modal"> Logg inn </div>
                <div id="registerbutton" class="modalbutton" for="register-modal"> Registrer </div>
            `);

            initModalSystemHandlers();
            initLoginSystem();
            initRegisterSystem();
        }

        def.resolve();
    });

    return def;
}

function initLoginSystem(){
    $("#login").off();
    $("#login").on('submit', (e) => {
        e.preventDefault();

        var username, password;
        username = $("#login #username").val();
        password = $("#login #password").val();

        $.ajax({
            url: "api?type=login",
            method: "POST",
            data: {
                username: username,
                password: password
            }
        }).done((json) => {
            var result = JSON.parse(json);

            if (result.success){
                loadLogin();
                $("#login-modal modalheader div").click();
            } else {
                alert(result.message);
            }
        });
    });
}

function initRegisterSystem(){
    $("#register").off();
    $("#register").on('submit', (e) => {
        e.preventDefault();

        var username, password1, password2;
        username = $("#register #username").val();
        password1 = $("#register #password1").val();
        password2 = $("#register #password2").val();

        $.ajax({
            url: "api?type=register",
            method: "POST",
            data: {
                username: username,
                password1: password1,
                password2: password2
            }
        }).done((json) => {
            var result = JSON.parse(json);

            if (result.success){
                loadLogin();
                $("#register-modal modalheader div").click();
            } else {
                alert(result.message);
            }
        });
    });
}

function loadURL(url){
    switch(url){
        case "":
            $("#home").show();
            $("#subject > div[for=home]").addClass("active");
            break;
        case "home":
            $("#home").show();
            $("#subject > div[for=home]").addClass("active");
            break;
        case "products":
            $("#products").show();
            $("#subject > div[for=products]").addClass("active");
            break;
        case "cart":
            $("#finish").show();
            $("#subject > div[for=finish]").addClass("active");
            break;
        default:
            $("#404page").show();
            break;

    }
}


// Initialises the system responsible for tabs
function initSelectionSystem(){
     // When a tab button is clicked...
    $(".selection > div").click(function(event){

        // Select the div that should open when this tab button is pressed
        var tab = $("#" + $(this).attr("for"));

        // If it is active from before...
        if($(this).hasClass("active")){

            // Then unactivate the button
            $(this).removeClass("active");

            // And slide up
            tab.slideUp();

        } else {
            // Else do the following:

            // Make this the active tab
            $(this).addClass('active');

            // Retrive the group of the tab-button parent, i.e. which 'group' of tabs it is from
            var parentid = $(this).parent().attr('group');

            // If there is another active tab...
            if($(".selection[group="+parentid+"]").children('.active').length > 1){

                // Make all those other tab buttons inactive
                $(".selection[group="+parentid+"]").children().removeClass('active');
                $(this).addClass('active');


                // Using this group, slide up the corresponing tabs (takes aprox. 1 second), and when done...
                $(".selectionelement[for=" + parentid + "]").slideUp().promise().done(() => {

                    // and if this tab-button is still active (no other tab button has been clicked during the animation),
                    if($(this).hasClass('active')){

                        // Slide down the correct tab
                        tab.slideDown();

                        $('.selection-scroller').animate({
                            scrollTop: tab.offset().top - 10
                        });
                    }
                });

            } else {
                // Else just slide down the tab
                tab.slideDown();

                $('.selection-scroller').animate({
                    scrollTop: tab.offset().top - 10
                });
            }


        }

    });
}


// Starts the slideshow
function startSlideshow(){

    // Variable to keep track of which slide is being displayed
    var slide = -1;

    // Function that makes the program go to the next slide
    nextSlide = function(){
        // Increment the slide index by one, and if it tips over the gallery length, then bring it back to zero.
        slide = (slide + 1) % gallery.length;

        // Change the src of the slide image to the next one
        $("#slide").attr('src', gallery[slide].path);

        // Change the text of the image to the next one
        $("#slide_text").html(gallery[slide].text);
    }

    // Call the function once first to have an image from the get-go
    nextSlide();

    // Then call it every 4 seconds
    setInterval(nextSlide, 4000);
}

function initModalSystem(){
    $("modal").each(function(){
        var modalheader = $("<modalheader>");
        var header      = $("<h2>");
        var closebutton = $("<div>");

        header.html($(this).attr("title"));
        closebutton.html("&#10005;");

        closebutton.click(() => {
            $(this).animate({top: "150vh"});
            $("body > div").css({"filter": "brightness(100%)", "pointer-events":"all"});
        });

        modalheader.append(header);
        modalheader.append(closebutton);

        $(this).prepend(modalheader);
    });

    initModalSystemHandlers();
}

function initModalSystemHandlers(){
    $(".modalbutton").off();
    $(".modalbutton").click(function(){
        $("modal#" + $(this).attr("for")).animate({top: 100});
        $("body > div").css({"filter": "brightness(30%)", "pointer-events":"none"});
    });
}

function fetchPoststed(postnummer, messageCallback){
    messageCallback("Vennligst vent...");

    $.ajax({
        url: "api?type=poststed",
        method: "POST",
        data: {
            postnummer: postnummer
        }
    }).done((json) => {
        var data = JSON.parse(json);

        if (data.ok){
            messageCallback(data.message);
        } else {
            messageCallback("Postnummeret er invalid");
        }
    });
}
