// Wechsel Whiteboard <-> Tafel

var bgGreen = false;
function bgboard() {
    if (bgGreen) {
        $.fn.whiteboard.changeBackground("white");
        bgGreen = false;
    }
    else {
       $.fn.whiteboard.changeBackground("#2f6f25");
       bgGreen = true;
    }
}

function setBgBoard(value) {
    bgGreen = value;
    bgboard(); 
}

// Farbauswahlelemente des jeweiligen Stifts einblenden

function colorPic(stift) {
    if ($('.colors').first().text() == stift) {
        $('.colors').text('');
        $('.colors').hide();
        $('#lineWidthRange').hide();
    }
    else {
        if (stift == "edit") {
            $('#lineWidthRange').show();
        }
        else {
            $('#lineWidthRange').hide();
        }
        $('.colors').show();
        $('.colors').text(stift);
    }
}

function alertMessage(messageClass, message) {

    var msg = "<div class='alertMsg " + messageClass + "'></div>";
    $(msg).appendTo("body")
        .html(message)
        .fadeIn().animate({
            top: "-=50"
        }, 2000).fadeOut();
}

var boardId = 0;
var creating = false; //Verhindert doppeltes speichern

function save() {
    var canvas = document.getElementById("whiteboard");
    var queryString = parseUrl();
    var sketch;

    //Update
    if (queryString || boardId) {
        sketch = {
            id: queryString[2],
            title: $("#boardtitle").val(),
            imageUrl: canvas.toDataURL(),
            bg: bgGreen === true ? 0 : 1//0 - Weiß, 1 - Grün
        };

        $.post('/updateBoard', {sketch}).done(function(result) {
            alertMessage("successAlert", "Board wurde aktualisiert!");
        });
    }
    else {

        if (!creating){
            creating = true;
            sketch = {
            title: $("#boardtitle").val(),
            imageUrl: canvas.toDataURL(),
            bg: bgGreen === true ? 0 : 1//0 - Weiß, 1 - Grün
        };
        $.post('/saveBoard', {sketch}).done(function(result){
        
        boardId = result.Id;
        //Nachricht anzeigen, dass Board gespeichert wurde
        alertMessage("successAlert", "Board wurde gespeichert!");

        var url = window.location.href;
        url += "?id=" + result.id;
        window.history.pushState(null ,null, url);

        }).fail(function(result){
            console.log(result);
        });
        }
    }
}


function parseUrl() {
    var url = window.location.href;
    var patt = new RegExp(/(\?id=)([\d]+)/);
    var result = patt.exec(url);

    return result;
}

function toggleStraight() {
    var el = $("#straight");
    if (el.data("active") == 0){;
        el.data("active", 1);
        $.fn.whiteboard.drawStraight(true);
    }
    else {
        el.data("active", 0);
        $.fn.whiteboard.drawStraight(false);
    }
}

function showDel(id, top) {
    $(id).css('top', '100%');
    $(id).show();
    $(id).animate({
        top: top
    }, 200);
}

// Farbe wählen

$(function(){
    $('#switchBg').click(function() {
        bgboard();
    });
    $('#marker').css('border-color','black');
    $('#pinsel').click(function() {
        colorPic('brush');
        var color = $.fn.whiteboard.getCurrentColor();
        $.fn.whiteboard.setBrushImage(color);
        $('#marker').css('border-color','transparent');
        $('#pinsel').css('border-color',color);
    });
    $('#marker').click(function() {
        colorPic('edit');
        var color = $.fn.whiteboard.getColorFromImage();
        $.fn.whiteboard.setColor(color);
        $('#pinsel').css('border-color','transparent');
        $('#marker').css('border-color',color);
    });

    $(".colors").click(function() {
        var colorData = $(this).data("color");

        if ($(this).text() == "brush") {
            $.fn.whiteboard.setBrushImage(colorData);
            $('.colors').css('background-color', 'transparent');
            $(this).css('background-color', 'rgba(255,255,255,0.2)');
            $('#marker').css('border-color','transparent');
            $('#pinsel').css('border-color',colorData);

        }
        else {
            $.fn.whiteboard.setColor(colorData);
            $('.colors').css('background-color', 'transparent');
            $(this).css('background-color', 'rgba(255,255,255,0.2)');
            $('#pinsel').css('border-color','transparent');
            $('#marker').css('border-color',colorData);

        }
    });
    $("#dialogDelete button").click(function() {
        $("#dialogDelete").hide();
    });
    $("#deleteYes").click(function() {
        $.fn.whiteboard.clearArea(true);
    });
    $("#lineWidthRange").on("input change", function(){
        $.fn.whiteboard.setLineWidth($(this).val());
    });
    $("#undo").click(function(){
        $.fn.whiteboard.undo();
    });
    $("#save").click(function(){
        save();
    });
    $('#clearBoard').click(function() {
        showDel('#dialogDelete', '16em');
    });
});

// Shortcuts

var keys = {};

$(document).keydown(function (e) {
    if (!$("#boardtitle").is(":focus")) {
        keys[e.which] = true;
    if (keys[16] && keys[90]) { // Shift + z
        // Einen Schritt rückgängig machen
        $.fn.whiteboard.undo();
    }
    if (keys[16] && keys[83]) { // Shift + s
        // Speichern
        save();
        // setTimeout(function(){
        //     context.putImageData(imageData, 0, 0);
        // },5000);

    }
    if (keys[16] && keys[68]) { // Shift + d
        //Inhalt löschen
        showDel('#dialogDelete', '16em');
        $('#deleteNo').focus();
    }
    if (keys[89]) { // y
        // Tafel wechseln
        bgboard();
    }
    if (keys[88]) { // x
        // Geraden zeichnen
    }
    if (keys[67]) { // c
        var color = $.fn.whiteboard.getCurrentColor();
        $.fn.whiteboard.setBrushImage(color);
        $('#marker').css('border-color','transparent');
        $('#pinsel').css('border-color',color);

    }
    if (keys[86]) { // v
        var color = $.fn.whiteboard.getColorFromImage();
        $.fn.whiteboard.setColor(color);
        $('#pinsel').css('border-color','transparent');
        $('#marker').css('border-color',color);

    }
    }
});
    
$(document).keyup(function (e) {
    delete keys[e.which];
});