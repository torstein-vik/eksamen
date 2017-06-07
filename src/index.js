

// Load everything, and then do the following
load().done(() => {
    // Hide all tabs
    $(".selectionelement").hide();

    // Initialises the system responsible for tabs
    initSelectionSystem();

    initModalSystem();

    // Load the specified URL
    loadURL(url);


    // Start the slideshow
    startSlideshow();

    // Show the previously hidden body (this is to prevent ugly loading)
    $("body").show();
});


function load(){
    DOMLoaded = new $.Deferred(function(){
        $(this.resolve);
    });

    return DOMLoaded.then(loadApartments).then(loadLogin).then(loadUserData);
}

function loadUserData(){
    var def = new $.Deferred();

    $.ajax({
        url:"/api?type=userreservations"
    }).done((json) => {
        var result = JSON.parse(json);

        $("#reservations").html("");

        if(result.success){

            $("#reservations").append("<h3> Brukerinfo: </h3>");
            $("#reservations").append("<strong>Telefonnummer:</strong> " + result.userdata.phone + "<br>");
            $("#reservations").append("<strong>Adresse:</strong> " + result.userdata.address + "<br><br>");
            $("#reservations").append("<h3> Reservasjoner: </h3>");


            if(result.reservations.length == 0){
                $("#reservations").append("Ingen reservasjoner");
            } else {
                var reservations_div = $("<div class='selection' id='userreservations' group='userreservations'>");

                $("#reservations").append(reservations_div);

                result.reservations.forEach((reservation, index) => {
                    var start = new Date(reservation.start * 1000);
                    var end   = new Date(reservation.end   * 1000);

                    var timediff = end.getTime() - start.getTime();
                    var daydiff = Math.ceil(timediff / (1000 * 3600 * 24));
                    var price = daydiff * reservation.price;

                    //reservations_div.append("<div for='userreservation"+index+"'> Leilighet " + reservation.apartmentnumber + " i " + start.toLocaleDateString("nb-NO", {month: "long"}) + " </div>");

                    var div = $("<div class='reservationdiv' for='userreservations' id='userreservation"+index+"'>");

                    var date_format = {month: "long", day: "numeric", year: "numeric"}

                    div.append("<h2> Leilighet " + reservation.apartmentnumber + " i " + start.toLocaleDateString("nb-NO", {month: "long"}) + "</h2>");

                    div.append("<strong>Leilighet:</strong> "+reservation.apartmentnumber+"<br>");
                    div.append("<strong>Fra:</strong> "+start.toLocaleDateString("nb-NO", date_format)+"<br>");
                    div.append("<strong>Til:</strong> "+  end.toLocaleDateString("nb-NO", date_format)+"<br>");
                    div.append("<strong>Total pris:</strong> "+  price+"<br>");

                    var cancel = $("<form><input type='submit' value='Avbestill'></form>");

                    cancel.on('submit', (e) => {
                        e.preventDefault();

                        if(window.confirm("Er du sikker?")){
                            $.ajax({
                                url:"/api?type=deletereservation",
                                method: "POST",
                                data: {
                                    reservationid: reservation.reservationid
                                }
                            }).done((json) => {
                                var result = JSON.parse(json);

                                if(result.success){
                                    div.slideUp().promise().done(loadUserData);
                                } else {
                                    alert(result.message);
                                }
                            });
                        }
                    });

                    div.append(cancel);


                    $("#reservations").append(div);
                });
            }


        } else {
            $("#reservations").html("Du må være innlogget for å se dine reservasjoner.");
        }

        def.resolve();
    });

    return def;
}

function loadApartments(){
    var def = new $.Deferred();

    $.ajax({
        url: "api?type=apartments"
    }).done((json) => {
        var result = JSON.parse(json);

        apartmentDeferreds = [];

        result.apartments.forEach((apartment, index) => {

            var imageDeferreds = [];
            var reservationDeferred = new $.Deferred();

            var div = $("<div id='apartment"+apartment.id+"' for='apartments' class='selectionelement'>");

            div.append("<h3> Leilighet "+apartment.number+" </h3>");

            div.append("<div id='main-image'><img src='/api?type=image&id="+apartment.featured_img+"'></div>");

            div.append("<p> "+apartment.description+" </p>");
            div.append("<p> Pris: "+apartment.price+"kr per natt </p>");

            div.append("<h4> Bilder </h4>");

            var image_selection = $("<div class='selection' id='images"+apartment.id+"' group='images"+apartment.id+"'> </div>");

            div.append(image_selection);

            apartment.images.forEach((image, index) => {
                imageDeferreds[index] = new $.Deferred;

                var image_button = $("<div for='image"+apartment.id+"-"+index+"' > </div>");

                image_selection.append(image_button);
                div.append("<div class='selectionelement apartmentimage' for='images"+apartment.id+"' id='image"+apartment.id+"-"+index+"'> <img src='api?type=image&id="+image+"'> </div>");

                $.ajax({
                    url: "/api?type=image&id="+image+"&form=text"
                }).done((res) => {
                    image_button.html(res);

                    imageDeferreds[index].resolve();
                });
            });

            div.append("<br><br>");
            div.append("<div class='selection' id='order' group='order'> <div style='width: 100%' for='reserve-"+apartment.id+"'>Reservér</div> </div>");

            var order = $("<div class='selectionelement' id='reserve-"+apartment.id+"' for='order'> </div>");

            var order_form = $("<form>");

            var date_start = $("<input type='date' id='date_start' required style='margin-bottom: 10px'>");
            var date_end   = $("<input type='date' id='date_end'   required style='margin-bottom: 10px'>");
            var price      = $("<span>Pris: -</span>");

            order_form.append("Startdato:");
            order_form.append(date_start);
            order_form.append("Sluttdato:");
            order_form.append(date_end);
            order_form.append(price);
            order_form.append("<input type='submit' value='Bestill!'>");

            calculate_price = () => {
                var start = date_start[0].valueAsDate;
                var end   = date_end[0].valueAsDate;

                if(start != null && end != null){
                    var timediff = end.getTime() - start.getTime();
                    var daydiff = Math.ceil(timediff / (1000 * 3600 * 24));

                    if(daydiff > 0){
                        price.html("Pris: " + daydiff * apartment.price + "kr");
                    } else {
                        price.html("Pris: -");
                    }
                } else {
                    price.html("Pris: -");
                }
            };

            date_start.on('input', calculate_price);
            date_end.on('input', calculate_price);

            order_form.on('submit', (e) => {
                e.preventDefault();

                $.ajax({
                    url: "/api?type=reserve",
                    method: "POST",
                    data: {
                        apartmentid: apartment.id,
                        date_start:  date_start[0].valueAsDate.getTime() / 1000,
                        date_end:    date_end[0].valueAsDate.getTime() / 1000
                    }
                }).done((json) => {
                    var result = JSON.parse(json);

                    if (result.success){
                        $("#order > *[for='reserve-"+apartment.id+"']").click();
                        loadUserData();
                    } else {
                        alert(result.message);
                    }
                });
            });

            order.append(order_form);

            order.append("<h4> Tidligere reservasjoner: </h4>")

            $.ajax({
                url: "api?type=reservations&id="+apartment.id
            }).done((json) => {
                var result = JSON.parse(json);

                if(result.reservations.length == 0){
                    order.append("Det er ingen reservasjoner på denne leiligheten!");
                } else {
                    result.reservations.forEach((reservation) => {
                        var start = new Date(reservation.start * 1000).toISOString().substring(0, 10);
                        var end   = new Date(reservation.end * 1000).toISOString().substring(0, 10);

                        order.append("Fra " + start + " til " + end + "<br>");
                    });
                }

                reservationDeferred.resolve();
            });

            div.append(order);

            $("#reserve").append(div);

            $("#apartments").append("<div for='apartment"+apartment.id+"'> <img src='/api?type=image&id="+apartment.featured_img+"'> Leilighet "+apartment.number+" </div>");

            apartmentDeferreds[index] = $.when.apply($, [reservationDeferred].concat(imageDeferreds));
        });

        $.when.apply($, apartmentDeferreds).done(() => {
            def.resolve();
        });
    });

    return def;
}

function loadLogin(){
    var def = new $.Deferred();

    loadUserData();

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
                            loadUserData();
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
            loadUserData();
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
                loadUserData();
                $("#login-modal modalheader > div").click();
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

        var username, address, postnum, phonenum, password1, password2;
        username  = $("#register #username").val();
        address   = $("#register #address").val();
        postnum   = $("#register #postnum").val();
        phonenum  = $("#register #phonenum").val();
        password1 = $("#register #password1").val();
        password2 = $("#register #password2").val();

        $.ajax({
            url: "api?type=register",
            method: "POST",
            data: {
                username:  username,
                address:   address,
                postnum:   postnum,
                phonenum:  phonenum,
                password1: password1,
                password2: password2
            }
        }).done((json) => {
            var result = JSON.parse(json);

            if (result.success){
                loadLogin();
                loadUserData();
                $("#register-modal modalheader > div").click();
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
        case "reserve":
            $("#reserve").show();
            $("#subject > div[for=reserve]").addClass("active");
            break;
        case "reservations":
            $("#reservations").show();
            $("#subject > div[for=reservations]").addClass("active");
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

                        /*$('.selection-scroller').animate({
                            scrollTop: tab.offset().top - 10
                        });*/
                    }
                });

            } else {
                // Else just slide down the tab
                tab.slideDown();

                /*$('.selection-scroller').animate({
                    scrollTop: tab.offset().top - 10
                });*/
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
