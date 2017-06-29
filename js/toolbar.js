// Wechsel Whiteboard <-> Tafel

var board = false;
function bgboard() {
    if (board) {
        $.fn.whiteboard.changeBackground("white");
        board = false;
    }
    else {
        $.fn.whiteboard.changeBackground("#2f6f25");
        board = true;
    }
}

function setBgBoard(value) {
    board = value;
    bgboard(); 
}

// Farbauswahl des jeweiligen Stifts anzeigen

function colors(stift) {
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

// Ausgewählten Stift farblich markieren

function markiere(before, after, newColor) {
    $('#' + before).css("background-color","");
    $('#' + before).css("border-color","rgba(0,0,0,0)");
    $('#' + after).css("background-color","rgba(255,255,255,0.2)");
    $('#' + after).css("border-color",newColor);
}

function save() {
    var canvas = document.getElementById("whiteboard"); //getContext("2d");
    //var imageData = context.getImageData(0,0,$("#whiteboard").width(), $("#whiteboard").height());
    /*var context = canvas.getContext("2d");
    var data = canvas.toDataURL();
    var img = new Image();
    img.src = data;

    $.fn.whiteboard.clearArea();

    img.onload = function() {
        context.drawImage(this, 0, 0)
    };

    delete img;*/

    var sketch = {
        title: $("#boardtitle").val(),
        imageUrl: canvas.toDataURL(),
        bg: board === true ? 0 : 1//0 - Weiß, 1 - Grün
    };

    $.post('/saveBoard', {sketch}).done(function(result){
        
        //Nachricht anzeigen, dass Board gespeichert wurde
        $(".successAlert").fadeIn().animate({
            top: "-=50"
        }, 3000).fadeOut();

    }).fail(function(result){
        console.log(result);
    });
}

// Farbe wählen

$(function(){
    $(".colors").click(function() {
        var colorData = $(this).data("color");

        if ($(this).text() == "brush") {
            $.fn.whiteboard.setBrushImage(colorData);
            markiere('marker', 'pinsel', colorData);
        }
        else {
            $.fn.whiteboard.setColor(colorData);
            markiere('pinsel', 'marker', colorData);
        }
    });
    $("#dialogDelete button").click(function() {
        $("#dialogDelete").hide();
    });
    $("#deleteYes").click(function() {
        $.fn.whiteboard.clearArea(true);
    })
    $("#straight").click(function() {
        toggleStraight();
    })
    $("#lineWidthRange").on("input change", function(){
        $.fn.whiteboard.setLineWidth($(this).val());
    });
    $("#undo").click(function(){
        $.fn.whiteboard.undo();
    });
    $("#save").click(function(){
        save();
    });
});

// Shortcuts

var keys = {};

$(document).keydown(function (e) {
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
        $('#dialogDelete').show();
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
        markiere('marker', 'pinsel', color);
    }
    if (keys[86]) { // v
        var color = $.fn.whiteboard.getColorFromImage();
        $.fn.whiteboard.setColor(color);
        markiere('pinsel', 'marker', color);
    }
});
    
$(document).keyup(function (e) {
    delete keys[e.which];
});