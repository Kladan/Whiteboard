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

// Farbauswahl des jeweiligen Stifts anzeigen

function colors(stift) {
    if ($('.colors').first().text() == stift) {
        $('.colors').text('');
        $('.colors').hide();
    }
    else {
        $('.colors').show();
        $('.colors').text(stift);
    }
}

// Farbe wählen

$(function(){
    $(".colors").click(function() {
        var colorData = $(this).data("color");

        if ($(this).text() == "brush") {
            $.fn.whiteboard.setBrushImage(colorData);
        }
        else {
            $.fn.whiteboard.setColor(colorData);
        }
    });
    $("#dialogDelete button").click(function() {
        $("#dialogDelete").hide();
    });
    $("#deleteYes").click(function() {
        $.fn.whiteboard.clearArea();
    })
    $("#lineWidthRange").on("input change", function(){
        $.fn.whiteboard.setLineWidth($(this).val());
    });
});

// Shortcuts

var keys = {};

$(document).keydown(function (e) {
    keys[e.which] = true;
    if (keys[16] && keys[90]) { // Shift + z
        // Einen Schritt rückgängig machen
    }
    if (keys[16] && keys[83]) { // Shift + s
        // Speichern
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
        // Brush wählen
        var color = $.fn.whiteboard.getCurrentColor();
        $.fn.whiteboard.setBrushImage(color);
    }
    if (keys[86]) { // v
        var color = $.fn.whiteboard.getColorFromImage();
        $.fn.whiteboard.setColor(color);
    }
});
    
$(document).keyup(function (e) {
    delete keys[e.which];
});